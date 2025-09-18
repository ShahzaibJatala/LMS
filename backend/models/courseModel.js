import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advance"],
  },
  price: {
    type: Number,
  },
  thumnil: {
    type: String,
  },
  enrollStudent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lactures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lacture",
    },
  ],
  creator: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  
  isPublished: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      review: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
