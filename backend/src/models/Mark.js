import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  marks: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { timestamps: true });

MarkSchema.index({ test: 1, student: 1 }, { unique: true });

// Custom validator to ensure marks <= test.maxMarks
MarkSchema.path("marks").validate(async function(value) {
  const Test = mongoose.model("Test");
  const testDoc = await Test.findById(this.test);
  if (testDoc && value > testDoc.maxMarks) {
    return false;
  }
  return true;
}, "Marks cannot exceed maximum marks for the test");

export default mongoose.model("Mark", MarkSchema);
