const { Schema, model } = require('mongoose')

const memesSchema = Schema({ //new
    name: {
        type: String,
        required: [true, "the name of the meme is required"],
        trim: true
    },
    file: {
        id: String,
        url: {
            type: String,
        }
    },
    fromuser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

const MemeModel = model('memes', memesSchema)

module.exports = MemeModel;