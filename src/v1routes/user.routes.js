const userRouter = require("express").Router();
const userController = require("../controllers/users.controller")
const { jwtCheck } = require("../middlewares/jwt-middleware")

userRouter
    .get("/", userController.getAllUsers ) //jwtCheck
    .get("/:id", userController.getUserById)  //jwtCheck
    .post("/create", userController.loginUser)
    .delete("/:id", userController.deleteUser) //jwtCheck
    // .patch("/:id", )

module.exports = userRouter;