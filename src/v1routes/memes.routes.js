const memeRouter = require("express").Router();
const memeController = require("../controllers/memes.controller")
const { jwtCheck } = require("../middlewares/jwt-middleware")

memeRouter
    .get("/", memeController.getAllMemes ) //jwtCheck,
    .get("/:id", memeController.getMemeByID ) //jwtCheck,
    .post("/create", memeController.createMeme) //jwtCheck,
    .delete("/:id", memeController.deleteMeme) //jwtCheck,
    .patch("/:id", memeController.updateMeme) //jwtCheck,

module.exports = memeRouter;