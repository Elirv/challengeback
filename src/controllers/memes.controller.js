const mongoose = require("mongoose")
const { Meme } = require("../models/meme.model")
const { User } = require("../models/user.model")
const fs = require("fs-extra")

const getAllMemes = async (req, res) => {
        try {
            const memes = await Meme
                .find({})
                .sort({ createdAt: -1 })
                .populate("tags")
                .populate("owner")
                .populate("likes")
                // .populate("comments")
                .lean()
                .exec()

            if (memes.length === 0) {
                return res.status(404).send({
                    status: "false",
                    message: "No memes found"
                })
            }
            res.status(200).send({
                status: "OK",
                data: memes
            })
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }
const getMemeByID = async (req, res) => {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                status: "false",
                message: "Invalid ID"
            })
        }

        try {
            const meme = await Meme
                .findById(id)
                .populate("tags")
                .populate("owner")
                .populate("likes")
                // .populate("comments")
                .lean()
                .exec()

            if (!meme) {
                return res.status(404).send({
                    status: "false",
                    message: "Meme not found"
                })
            }
            res.status(200).send({
                status: "OK",
                data: meme
            })
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }
const createMeme = async (req, res) => {
        const { body, files } = req
        const tagsObjectIds = body?.tags.split(",").map(tag => mongoose.Types.ObjectId(tag))
        const newBody = {
            ...body,
            tags: tagsObjectIds
        }

        try {
            const { image } = files
            // Upload image to S3
            const imageName = image.name;
            const { Key, Location } = await uploadFile(image.tempFilePath, imageName)
            await fs.unlink(image.tempFilePath)

            // Create new meme
            const meme = await Meme.create({
                ...newBody,
                image: {
                    key: Key,
                    url: Location
                }
            })
            const memeId = mongoose.Types.ObjectId(meme._id)
            const updatedUser = await User.findByIdAndUpdate(
                { _id: body.owner },
                {
                    $push: {
                        myMemes: memeId
                    }
                },
                { new: true }
            )
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

            res.status(201).send({
                status: "Created",
                data: {
                    meme,
                    updatedUser
                }
            })
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }
const updateMeme = async (req, res) => {
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
                const memeExists = await Meme.findById(id).lean().exec()

                if (!memeExists) {
                    return res.status(409).send({
                        status: "false",
                        message: "Meme does not exists"
                    })
                } else {
                    // Delete old image from S3
                    if (memeExists.image.key) {
                        await deleteFile(memeExists.image.key)
                    }
                    // Upload new image to S3
                    const imageName = image.name;
                    const { Key, Location } = await uploadFile(image.tempFilePath, imageName)
                    await fs.unlink(image.tempFilePath)

                    // Update meme
                    const meme = await Meme.findByIdAndUpdate(id, {
                        ...body,
                        image: {
                            key: Key,
                            url: Location
                        }
                    }, { new: true })
                        .populate("tags")
                        .populate("owner")
                        .populate("likes")
                        // .populate("comments")
                        .lean()
                        .exec()

                    res.status(200).send({
                        status: "OK",
                        data: meme
                    })
                }
            } else {
                const memeExists = await Meme.findById(id).lean().exec()

                if (!memeExists) {
                    return res.status(409).send({
                        status: "false",
                        message: "Meme does not exists"
                    })
                } else {
                    const meme = await Meme.findByIdAndUpdate(id, {
                        ...body
                    }, { new: true })
                        .populate("tags")
                        .populate("owner")
                        .populate("likes")
                        // .populate("comments")
                        .lean()
                        .exec()

                    res.status(200).send({
                        status: "OK",
                        data: meme
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
const deleteMeme = async (req, res) => {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                status: "false",
                message: "Invalid ID"
            })
        }

        try {
            const memeExists = await Meme.findById(id).lean().exec()

            if (!memeExists) {
                return res.status(409).send({
                    status: "false",
                    message: "Meme does not exists"
                })
            } else {
                // Delete image from S3
                if (memeExists.image.key) {
                    await deleteFile(memeExists.image.key)
                }
                // Delete user
                await Meme.findByIdAndDelete(id)
                res.status(200).send({
                    status: "OK",
                    message: "Meme deleted"
                })
            }
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }
const searchMemes = async (req, res) => {
        const { query } = req

        try {
            const memes = await Meme
                .find({ $text: { $search: query } })
                .populate("tags")
                .populate("owner")
                .populate("likes")
                // .populate("comments")
                .lean()
                .exec()

            if (!memes) {
                return res.status(404).send({
                    status: "false",
                    message: "Memes not found"
                })
            }
            res.status(200).send({
                status: "OK",
                data: memes
            })
        } catch (error) {
            res.status(500).send({
                status: "false",
                message: error.message
            })
        }
    }

module.exports = { getAllMemes, getMemeByID, createMeme, updateMeme, deleteMeme, searchMemes }





// const MemeModel = require('../models/meme.model')
// const UserModel = require('../models/user.model')

// const getAllMemes = (req, res, next) => {
//     try {
//         const allMemes = MemeModel
//         .find({})
//         .populate("fromuser")
//         .lean()
//         .exec((error, allMemes) => {
//             res.status(200).json({ status: true, data: allMemes})
//         })
//     } catch (error) {
//         req.status(500).send({ status: false, msg: error.message })

//     }
// }

// const getMemeByID = async (req, res, next) => {
//     const { id } = req.params
//     try {
//         const meme = await MemeModel.findById(id).lean().exec()

//         res.status(200).send({ status: true, data: meme })
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }

// const createMeme = async (req, res, next) => {
//     const { id } = req.params
//     const { name, file, fromuser } = req.body

//     try {
//         const newMeme = await MemeModel.create({
//             name,
//             file,
//             fromuser
//         })
//         if (id) {
//             await UserModel
//                 .updateOne(
//                     { _id: id },
//                     { $push: { memes: newMeme._id } }
//                 )
//         }
//         res.status(201).send({ status: true, data: newMeme._id })

//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }

// const updateMeme = async (req, res, next) => {
//     const { id } = req.params
//     const { ...fields } = req.body

//     try {
//         const meme = await MemeModel
//         .findOneAndUpdate(
//             { _id: id },
//             {
//                 $set: {
//                     ...fields
//                 }
//             },
//             { new: true })
//         .lean()
//         .exec()

//         res.status(200).send({ status: true, data: meme })
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }

// const deleteMeme = async (req, res, next) => {
//     const { id } = req.params
//     try {
//         const meme = await MemeModel.findOneAndDelete({ _id: id })

//         res.status(200).send({ status: true, data: meme._id })
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }

// module.exports = { getAllMemes, getMemeByID, createMeme, updateMeme, deleteMeme }