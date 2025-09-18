import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js"


export const getCurrentUser = async (req,res) => {
    
    try {
        const user = await User.findById(req.userId).select("-password");

        if(!user) {
            return res.status(404).json({message:"user not found"});
        }

        return res.status(200).json({user})

    } catch (error) {
        return res.status(500).json({message:`Get current user error ${error}`})
    }
}

export const updateProfile = async (req,res) => {
    try {
        const userId = req.userId;
        const { description, username } = req.body;
        let photoURL
        if(req.file) {
            photoURL = await uploadOnCloudinary(req.file.path);
        }
        const user = await User.findByIdAndUpdate(userId, {name : username, description, photoURL});

        if(!user) {
            return res.status(404).json({message:"user not found"});
        }

        return res.status(200).json({user})
        
    } catch (error) {
        return res.status(500).json({message:`User not found ${error}`})
 
    }
    
}