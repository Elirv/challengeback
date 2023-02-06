// const express = require("express")

const app = require("./server");
// const connectDataBase = require("./database/mongoose");
const express = require("express")
// const fileUpload = require("express-fileupload")
// const { connectDB } = require("./utils/mongoose")
const {
    PORT,
    // DB,
    // APP_ORIGIN,
    // VERSION,
    // ROUTING_VERSION
} = require("./config/config")


// const app = express()
// app.get('/', (req, res) => {
//     res.send('holi');
// })
// app.listen(process.env.PORT, () => {
//     console.log(`Server is running in port ${process.env.PORT}`);
// })
const startServer = async () => {
    try {
        await connectDataBase(config.logger.info("MongoDB connected"));
        app.listen(process.env.PORT, () => {
            config.logger.info(`Server is running in port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Someting went wrong, server crashed!");
    }
};

// startServer();

// app.use(cors({ origin: APP_ORIGIN }))

// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: './src/assets/tmp'
// }))

// Connection to DB
// connectDB(app, PORT, DB)

// Routes
// const { users } = require(ROUTING_VERSION)
// app.use(`${VERSION}users`, users)

// const { playlists } = require(ROUTING_VERSION)
// app.use(`${VERSION}playlists`, playlists)
