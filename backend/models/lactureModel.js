import mongoose from "mongoose";

const lactureSchema = new mongoose.Schema({
  lactureTitle: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  isPriviewFree: {
    type: Boolean,
    default: false, // global preview available for everyone
  },
}, { timestamps: true });

const Lacture = mongoose.model("Lacture", lactureSchema);

export default Lacture;
