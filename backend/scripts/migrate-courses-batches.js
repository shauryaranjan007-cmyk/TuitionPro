import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../src/models/Course.js";
import Batch from "../src/models/Batch.js";

dotenv.config();

async function migrate() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const studentsColl = mongoose.connection.collection("students");
  const batchesColl = mongoose.connection.collection("batches");
  const coursesColl = mongoose.connection.collection("courses");

  // Get all students
  const students = await studentsColl.find({}).toArray();

  for (const student of students) {
    if (typeof student.course === "string" && student.course.trim() !== "") {
      let courseDoc = await coursesColl.findOne({ name: student.course.trim() });
      if (!courseDoc) {
        const res = await coursesColl.insertOne({
          name: student.course.trim(),
          code: student.course.trim().substring(0, 4).toUpperCase(),
          duration: "6 Months",
          fee: 5000,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        courseDoc = { _id: res.insertedId, name: student.course.trim() };
      }
      student.courseId = courseDoc._id;
    }

    if (typeof student.batch === "string" && student.batch.trim() !== "") {
      let batchDoc = await batchesColl.findOne({ name: student.batch.trim() });
      if (!batchDoc) {
        const res = await batchesColl.insertOne({
          name: student.batch.trim(),
          course: student.courseId || null,
          schedule: "To be announced",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        batchDoc = { _id: res.insertedId };
      }
      student.batchId = batchDoc._id;
    }

    // Update the student with ObjectId references
    if (student.courseId || student.batchId) {
      const updateData = {};
      if (student.courseId) updateData.course = student.courseId;
      if (student.batchId) updateData.batch = student.batchId;

      await studentsColl.updateOne(
        { _id: student._id },
        { $set: updateData }
      );
    }
  }

  // Update existing batches course field from string to ObjectId
  const batches = await batchesColl.find({}).toArray();
  for (const batch of batches) {
    if (typeof batch.course === "string" && batch.course.trim() !== "") {
      let courseDoc = await coursesColl.findOne({ name: batch.course.trim() });
      if (!courseDoc) {
        const res = await coursesColl.insertOne({
          name: batch.course.trim(),
          code: batch.course.trim().substring(0, 4).toUpperCase(),
          duration: "6 Months",
          fee: 5000,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        courseDoc = { _id: res.insertedId, name: batch.course.trim() };
      }
      await batchesColl.updateOne(
        { _id: batch._id },
        { $set: { course: courseDoc._id } }
      );
    }
  }

  console.log("Migration complete.");
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
