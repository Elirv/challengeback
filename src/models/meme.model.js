const { Schema, model } = require('mongoose')

const memesSchema = new Schema({ 
    name: {
        type: String,
        required: [true, "the name of the meme is required"],
        trim: true
    },
    file: {
        id: String,
        url: {
            type: String,
            required: true,
        }
    },
    fromuser: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }, 
    //timestamps: true
})

const MemeModel = model('memes', memesSchema)

module.exports = MemeModel;