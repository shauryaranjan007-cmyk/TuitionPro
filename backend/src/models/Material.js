import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., FILE, YouTube, Link
  link: { type: String, required: true }, // local path or URL
  fileType: { type: String },
  size: { type: Number }
}, { timestamps: true });

export default mongoose.model("Material", MaterialSchema);
