import express from 'express'
import { googleAuth, login, logout, resetPassword, sendOTP, signUp, verifyOTP } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/sendOTP", sendOTP);
authRouter.post("/verifyOTP", verifyOTP);
authRouter.post("/resetPassword", resetPassword);
authRouter.post("/googleauth", googleAuth);


export {authRouter}