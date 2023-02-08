const memeRouter = require("express").Router();
const memeController = require("../controllers/memes.controller")
const { jwtCheck } = require("../middlewares/jwt-middleware")

memeRouter
    .get("/", jwtCheck, memeController.getAllMemes )
    .get("/:id", jwtCheck, memeController.getMemeByID ) 
    .post("/create", jwtCheck, memeController.createMeme)
    .delete("/:id", jwtCheck, memeController.deleteMeme)
    .patch("/:id", jwtCheck, memeController.updateMeme)

module.exports = memeRouter;