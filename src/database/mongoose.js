const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

function connectDataBase() {
    mongoose.connect(config.db.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = { connectDataBase }