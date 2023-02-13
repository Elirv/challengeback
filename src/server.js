const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { json } = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const memeRouter = require("./routes/meme.routes");
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(
    json({
        limit: "50mb",
    })
);

// Routes
app.use("/memes", memeRouter);
app.use("/user", userRouter);

module.exports = app;