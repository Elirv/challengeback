const express = require("express")
const userRouter = express.Router()
const {userController} = require("../controllers/users.controller")
// const { checkJwt } = require("../../middlewares/checkJwt.middleware")

userRouter
    .get("/", userController.getAllUsers )
    .get("/:id", userController.getUserById)
    // .post("/", )
    // .delete("/:id", )
    // .patch("/:id", )

module.exports = userRouter;