const mongoose = require("mongoose")
const { User } = require("../models/user.model")
const fs = require("fs-extra")

const getAllUsers = async (req, res) => {
        try {
            const users = await User
                .find({})
                .sort({ createdAt: -1 })
                .populate({
                    path: "myMemes",
                    populate: [
                        { path: "tags" },
                        { path: "owner" }
                    ]
                })
                .populate("likedMemes")
                .lean()
                .exec()

            if (users.length === 0) {
                return res.status(404).send({
                    status: "false",
                    message: "No users found"
                })
            }
            res.status(200).send({
                status: "OK",
                data: users
            })
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }

const getUserById = async (req, res) => {
        const { id } = req.params

        try {
            const user = await User
                .findById(id)
                .populate({
                    path: "myMemes",
                    populate: [
                        { path: "tags" },
                        { path: "owner" }
                    ]
                })
                .populate("likedMemes")
                .lean()
                .exec()

            if (!user) {
                return res.status(404).send({
                    status: "false",
                    message: "User not found"
                })
            }
            res.status(200).send({
                status: "OK",
                data: user
            })
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }

const createUser = async (req, res) => {
        const { body } = req

        try {
            const userExists = await User.findOne({ email: body.email }).lean().exec()
            if (userExists) {
                return res.status(409).send({
                    status: "false",
                    message: "User already exists"
                })
            } else {
                const user = await User.create({ ...body })
                res.status(201).send({
                    status: "Created",
                    data: user
                })
            }
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }

const patchUser = async (req, res) => {
        const { params: { id }, body, files } = req

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                status: "false",
                message: "Invalid ID"
            })
        }

        try {
            if (files) {
                const { image } = files
                const userExists = await User.findById(id).lean().exec()

                if (!userExists) {
                    return res.status(409).send({
                        status: "false",
                        message: "User does not exists"
                    })
                } else {
                    // Delete old image from S3
                    if (userExists.image.key) {
                        await ('deletefile')//deleteFile(userExists.image.key)
                    }
                    // Upload new image to S3
                    const { Key, Location } = await ('upload file')//uploadFile(image.tempFilePath, image.name)
                    await fs.unlink(image.tempFilePath)

                    // Update user
                    const user = await User.findByIdAndUpdate(id, {
                        ...body,
                        image: {
                            key: Key,
                            url: Location
                        }
                    }, { new: true })
                        .populate({
                            path: "myMemes",
                            populate: [
                                { path: "tags" },
                                { path: "owner" }
                            ]
                        })
                        .populate("likedMemes")
                        .lean()
                        .exec()

                    res.status(200).send({
                        status: "OK",
                        data: user
                    })
                }
            } else {
                const userExists = await User.findById(id).lean().exec()

                if (!userExists) {
                    return res.status(409).send({
                        status: "false",
                        message: "User does not exists"
                    })
                } else {
                    const user = await User.findByIdAndUpdate(id, {
                        ...body
                    }, { new: true })
                        .populate({
                            path: "myMemes",
                            populate: [
                                { path: "tags" },
                                { path: "owner" }
                            ]
                        })
                        .populate("likedMemes")
                        .lean()
                        .exec()

                    res.status(200).send({
                        status: "OK",
                        data: user
                    })
                }
            }
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }
    
const deleteUser = async (req, res) => {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                status: "false",
                message: "Invalid ID"
            })
        }

        try {
            const userExists = await User.findById(id).lean().exec()

            if (!userExists) {
                return res.status(409).send({
                    status: "false",
                    message: "User does not exists"
                })
            } else {
                // Delete image from S3
                if (userExists.image.key) {
                    await ('delete i f user exist') //deleteFile(userExists.image.key)
                }
                // Delete user
                await User.findByIdAndDelete(id)
                res.status(200).send({
                    status: "OK",
                    message: "User deleted"
                })
            }
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }

module.exports = { getAllUsers, getUserById, createUser, patchUser, deleteUser }



// const userModel = require("../models/user.model");

// const getAllUsers = async (req, res) => {
//     try {
//         const users = await userModel
//             .find({})
//             .limit(10)
//             .sort({ date: -1 })
//             .populate("memes")
//             .lean()
//             .exec()

//         if (users.length < 1) {
//             return res.status(404).send({
//                 status: "FALSE",
//                 message: `The DB is currently empty`
//             })
//         }

//         res.status(200).send(users)

//     } catch (err) {
//         res.status(400).send(err.message)
//     }
// }

// const getUserById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const user = await userModel
//             .findById(id)
//             .populate("memes")
//             .lean()
//             .exec()

//         if (!user) {
//             return res.status(404).send({
//                 status: "FALSE",
//                 message: `User ${id} was not found`
//             })
//         }
//         res.status(200).send(user)

//     } catch (err) {
//         res.status(400).send(err.message)
//     }
// }

// const loginUser = async (req, res, next) => {
//     const { email } = req.body;

//     try {
//         const userDBexists = await userModel.findOne({ email }).lean().exec();
//         if (userDBexists) {
//             res.status(200).send({ status: true, data: userDBexists });
//         } else {
//             const userDB = await userModel.create(req.body);
//             res.status(201).send({ status: true, data: userDB });
//         }
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message });
//     }
// }

// const deleteUser = async (req, res, next) => {
//     const { id } = req.params
//     try {
//         const user = await userModel.findOneAndDelete({ _id: id })

//         res.status(200).send({ status: true, data: user._id })
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }

// module.exports = { getAllUsers, getUserById, loginUser, deleteUser };