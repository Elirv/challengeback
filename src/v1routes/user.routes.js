const userRouter = require("express").Router();
const userController = require("../controllers/users.controller")
const { jwtCheck } = require("../middlewares/jwt-middleware")

userRouter
    .get("/", jwtCheck, userController.getAllUsers )
    .get("/:id", jwtCheck, userController.getUserById)
    .post("/create", userController.loginUser)
    .delete("/:id", userController.deleteUser) //jwtCheck
    // .patch("/:id", )

module.exports = userRouter;