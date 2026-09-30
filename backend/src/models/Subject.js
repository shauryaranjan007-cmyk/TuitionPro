import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model("Subject", SubjectSchema);
