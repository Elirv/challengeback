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

const getUserById =  async (req, res) => {
    const { params: { id } } = req

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({
            status: "FALSE",
            message: `${id} is an invalid ID`
        })
    }

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

module.exports = { getAllUsers, getUserById };