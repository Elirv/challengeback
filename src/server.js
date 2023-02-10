const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { json } = require("body-parser");
const cors = require("cors");
const userRouter = require("./v1routes/user.routes");
const memesRouter = require("./v1routes/memes.routes");
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
app.use("/user", userRouter);
app.use("/memes", memesRouter);

module.exports = app;