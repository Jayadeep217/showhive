const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  requestOtp,
  updatePassword,
  getAllUsers,
  updateUserRole,
} = require("../controllers/user.controller.js");
const { authorize, requireRole } = require("../middlewares/auth.middleware.js");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/user", authorize, getUser);
userRouter.post("/otp/request", authorize, requestOtp);
userRouter.put("/password", authorize, updatePassword);
userRouter.get("/all", authorize, requireRole("admin"), getAllUsers);
userRouter.put("/:id/role", authorize, requireRole("admin"), updateUserRole);

module.exports = userRouter;
