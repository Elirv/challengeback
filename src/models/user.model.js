const { Schema, model } = require("mongoose")
const validator = require("validator")

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "the username is required"],
        trim: true,
    },
    firstname: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "the email is required"],
        unique: [true, "the email must be unique"],
        trim: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: props => `The email ${props.value} is not valid.`
        }
    },
    memes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'memes',
            default: []
        }
    ]
});

const userModel = model("users", userSchema);

module.exports = model(userModel)