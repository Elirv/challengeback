const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { json } = require("body-parser");
const cors = require("cors");
// const userRouter = require("./routes/user.routes");
// const playlistRouter = require("./routes/playlist.routes");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(
    json({
        limit: "50mb",
    })
);

// app.use("/playlists", playlistRouter);
// app.use("/user", userRouter);


module.exports = app;
