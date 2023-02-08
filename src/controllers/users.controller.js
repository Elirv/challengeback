const userModel = require("../models/user.model");

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel
            .find({})
            .limit(10)
            .sort({ date: -1 })
            .populate("memes")
            .lean()
            .exec()

        if (users.length < 1) {
            return res.status(404).send({
                status: "FALSE",
                message: `The DB is currently empty`
            })
        }

        res.status(200).send(users)

    } catch (err) {
        res.status(400).send(err.message)
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel
            .findById(id)
            .populate("memes")
            .lean()
            .exec()

        if (!user) {
            return res.status(404).send({
                status: "FALSE",
                message: `User ${id} was not found`
            })
        }
        res.status(200).send(user)

    } catch (err) {
        res.status(400).send(err.message)
    }
}

const loginUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        const userDBexists = await userModel.findOne({ email }).lean().exec();
        if (userDBexists) {
            res.status(200).send({ status: true, data: userDBexists });
        } else {
            const userDB = await userModel.create(req.body);
            res.status(201).send({ status: true, data: userDB });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await userModel.findOneAndDelete({ _id: id })

        res.status(200).send({ status: true, data: user._id })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { getAllUsers, getUserById, loginUser, deleteUser };