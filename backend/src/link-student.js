import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Student from "./models/Student.js";
dotenv.config();

const userEmail=process.env.LINK_STUDENT_USER_EMAIL;
const studentCode=process.env.LINK_STUDENT_CODE;
if(!userEmail||!studentCode) throw new Error("Set LINK_STUDENT_USER_EMAIL and LINK_STUDENT_CODE in .env");

await mongoose.connect(process.env.MONGO_URI);
const user=await User.findOne({email:userEmail.toLowerCase()});
const student=await Student.findOne({studentCode});
if(!user) throw new Error("Student user account not found");
if(!student) throw new Error("Student record not found");

student.user=user._id;
await student.save();
console.log(`Linked ${student.studentCode} to ${user.email}`);
await mongoose.disconnect();
