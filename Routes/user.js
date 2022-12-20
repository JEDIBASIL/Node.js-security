import { registerUser, getAllUsers, getUser, login, getNotifications, verify, generate, info, generateForgotPasswordLink, forgotPassword, updateInfo } from "../Controller/user";
import { protect } from "../Middleware/auth";
import express from "express"

const userRouter = express.Router({ mergeParams: true })

userRouter.route("/register").post(registerUser)
userRouter.route("/verify").post(verify)
userRouter.route("/generate").post(generate)

userRouter.route("/login").post(login)
userRouter.route("/passlink").post(generateForgotPasswordLink)
userRouter.route("/resetpass").post(forgotPassword)


userRouter.route("/notifications").get(protect, getNotifications)
userRouter.route("/info").get(protect, info).patch(protect,updateInfo)
userRouter.route("/").get(getAllUsers)
userRouter.route("/:id").get(getUser)


export default userRouter;