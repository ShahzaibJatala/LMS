import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["teacher", "student"],
    default: "student",
  },
  photoURL: {
    type: String,
    default: "",
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  unlockedLectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lacture",
    },
  ],
  resetOtp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
