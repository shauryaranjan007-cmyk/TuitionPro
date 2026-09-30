import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Assignment", AssignmentSchema);
