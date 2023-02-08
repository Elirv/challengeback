const MemeModel = require('../models/meme.model')
const UserModel = require('../models/user.model')

const getAllMemes = (req, res, next) => {
    try {
        const allMemes = MemeModel
        .find({})
        .populate("fromuser")
        .lean()
        .exec((error, allMemes) => {
            res.status(200).json({ status: true, data: allMemes})
        })
    } catch (error) {
        req.status(500).send({ status: false, msg: error.message })

    }
}

const getMemeByID = async (req, res, next) => {
    const { id } = req.params
    try {
        const meme = await MemeModel.findById(id).lean().exec()

        res.status(200).send({ status: true, data: meme })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const createMeme = async (req, res, next) => {
    const { id } = req.params
    const { name, file, fromuser } = req.body

    try {
        const newMeme = await MemeModel.create({
            name,
            file,
            fromuser
        })
        if (id) {
            await UserModel
                .updateOne(
                    { _id: id },
                    { $push: { memes: newMeme._id } }
                )
        }
        res.status(201).send({ status: true, data: newMeme._id })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const updateMeme = async (req, res, next) => {
    const { id } = req.params
    const { ...fields } = req.body

    try {
        const meme = await MemeModel
        .findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    ...fields
                }
            },
            { new: true })
        .lean()
        .exec()

        res.status(200).send({ status: true, data: meme })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteMeme = async (req, res, next) => {
    const { id } = req.params
    try {
        const meme = await MemeModel.findOneAndDelete({ _id: id })

        res.status(200).send({ status: true, data: meme._id })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { getAllMemes, getMemeByID, createMeme, updateMeme, deleteMeme }