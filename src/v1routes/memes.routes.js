const memeRouter = require("express").Router();
const memeController = require("../controllers/memes.controller")
const { jwtCheck } = require("../middlewares/jwt-middleware")

memeRouter
    .get("/", memeController.getAllMemes ) 
    .get("/:id", memeController.getMemeByID ) 
    .post("/create", memeController.createMeme) //jwtCheck,
    .delete("/:id", memeController.deleteMeme) //jwtCheck,
    .patch("/:id", memeController.updateMeme) //jwtCheck,

module.exports = memeRouter;