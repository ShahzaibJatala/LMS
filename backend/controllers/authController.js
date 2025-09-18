import User from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs'
import { generateToken } from "../config/token.js";
import sendMail from "../config/sendMail.js";


export const signUp = async (req,res,next) => {
    try {
        const {name , email , password , role } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
        return res.status(400).json({message:"User already exit"})
        }
        if(!validator.isEmail(email)) {
         return res.status(400).json({message:"Enter valid email"})
        }
        if(password.length < 8) {
            return res.status(400).json({mesage:"Enter strong pasword"})
        }

        let hashPasword = await bcrypt.hash(password,10);

        // const user = await new User({
        const user = await User.create({
            name,
            email,
            password: hashPasword,
            role
        })

        let token = await generateToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message : `Signup error`})
        // return res.status(500).json({message : `Signup error ${error}`})
    }
}

export const login = async (req,res) => {
    try {
        
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if(!user) {
           return res.status(400).json({message:"User not found"})
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if(!isMatch) {
            return res.status(400).json({message:"Incorrect password"})
        }
    
        let token = await generateToken(user._id)
            res.cookie("token",token,{
                httpOnly:true,
                secure:false,
                sameSite:"Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
    
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message : `Login error`})
        // return res.status(500).json({message : `Login error ${error}`})

    }

}

export const logout = async (req,res) => {
    try {
        await res.clearCookie("token");
        return res.status(200).json({message:"Logout successfully"});
    } catch (error) {
        return res.status(500).json({message : `Logout error`})
        // return res.status(500).json({message : `Logout error ${error}`})
    }
}

export const sendOTP = async (req,res) => {
    try {
        const {email} = req.body;
        let user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message:"User not found"});
        }
    
        const otp = Math.floor(1000 + Math.random() * 8000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save()
    
        await sendMail(email,otp);

        return res.status(200).json({message:"OTP send successfully"});
        
    } catch (error) {
        return res.status(400).json({message:"OTP error"})        
    }
}

export const verifyOTP = async (req,res) => {
    try {
        const {email,otp} = req.body;
        let user = await User.findOne({email});
            if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
                return res.status(404).json({message:"User not found"});
            }
            user.isOtpVerified = true;
            user.resetOtp = undefined;
            user.otpExpires = undefined;
        
        await user.save()
    
        return res.status(200).json({message:"OTP verified successfully"});
        
    } catch (error) {
        return res.status(400).json({message:"OTP not verified"})        
   
    }       
}

export const resetPassword = async (req,res) => {
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email});
            if(!user || !user.isOtpVerified) {
                return res.status(404).json({message:"OTP verification require"});
            }
        
        let hashPasword = await bcrypt.hash(password,10);

        user.password = hashPasword;
        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({message:"Reset password successfully"});
        
    } catch (error) {
        return res.status(400).json({message:"Password is not reset"})        
   
        
    }
    
}

export const googleAuth = async (req,res) => {
    try {
        const {name, email, role} = req.body;
        console.log("GoogleAuth req.body:", req.body);

        // Add validation
        if (!name || !email || !role) {
          return res.status(400).json({ 
            error: "Missing required fields: name, email, and role" 
          })
        }
        let user = await User.findOne({email});
        if(!user) {
            user = await User.create({
                name,
                email,
                role
            })
        }
        let token = await generateToken(user._id)
            res.cookie("token",token,{
                httpOnly:true,
                secure:false,
                sameSite:"Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({message:"Google Auth error"})        
    
    }

}