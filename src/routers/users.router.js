const userRouter = require("express").Router();

const userController = require("../controllers/users.controller");

userRouter.get("", userController.listAllUsers);
userRouter.get("/:id", userController.detailUser);
userRouter.delete("/:id", userController.deleteUser);
userRouter.patch("/:id", userController.updateUser);

module.exports = userRouter;
