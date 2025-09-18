
import express from 'express'
import isAuth from '../middleware/isAuth.js';
import { getCurrentUser, updateProfile } from '../controllers/userController.js';
import upload from '../middleware/multer.js';

const userRoute = express.Router();

userRoute.get("/getcurrentuser",isAuth,getCurrentUser); 
userRoute.post("/updateProfile",isAuth, upload.single("photoURL"), updateProfile);


export {userRoute}