const memeRouter = require("express").Router();
const memeController = require("../controllers/meme.controller");

memeRouter
    .get("/get", memeController.getMemes)
    .post("/create", memeController.createMeme)
    .delete("/:id", memeController.deleteMeme);

module.exports = memeRouter;