import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  batch: { type: String, required: true },
  date: { type: Date, required: true },
  maxMarks: { type: Number, required: true, min: 1 }
}, { timestamps: true });

export default mongoose.model("Test", TestSchema);
