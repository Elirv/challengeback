const userRouter = require("express").Router();
const userController = require("../controllers/users.controller")
const { jwtCheck } = require("../middlewares/jwt-middleware")

userRouter
    .get("/", userController.getAllUsers ) 
    .get("/:id", userController.getUserById)  
    .post("/create", userController.createUser)
    .delete("/:id", userController.deleteUser) //jwtCheck
    // .patch("/:id", ) //jwtCheck

module.exports = userRouter;