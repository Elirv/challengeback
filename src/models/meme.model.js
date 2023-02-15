const { Schema, model } = require("mongoose");

const MemeSchema = Schema({
    name: {
        type: String,
        // required: [true, "The title is required"],
    },
    url: {
        type: String,
    },
    // fromUser: [{ type: Schema.Types.ObjectId, ref: "users" }],
});

const MemeModel = model("memes", MemeSchema);

module.exports = MemeModel;