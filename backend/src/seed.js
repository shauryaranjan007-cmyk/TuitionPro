import dotenv from "dotenv"; import mongoose from "mongoose"; import bcrypt from "bcryptjs";
import User from "./models/User.js"; import Student from "./models/Student.js"; import Course from "./models/Course.js"; import Batch from "./models/Batch.js"; import Attendance from "./models/Attendance.js"; import Payment from "./models/Payment.js";
dotenv.config();

if(process.env.NODE_ENV==="production") throw new Error("Do not run the destructive seed script in production.");
if(!process.env.MONGO_URI) throw new Error("MONGO_URI is required.");

const adminEmail=process.env.SEED_ADMIN_EMAIL||"admin@tuitionpro.local";
const adminPassword=process.env.SEED_ADMIN_PASSWORD;
const studentEmail=process.env.SEED_STUDENT_EMAIL||"student@tuitionpro.local";
const studentPassword=process.env.SEED_STUDENT_PASSWORD;
if(!adminPassword||!studentPassword) throw new Error("Set SEED_ADMIN_PASSWORD and SEED_STUDENT_PASSWORD in .env before running seed.");

await mongoose.connect(process.env.MONGO_URI);
import Subject from "./models/Subject.js"; import Material from "./models/Material.js"; import Assignment from "./models/Assignment.js"; import Test from "./models/Test.js"; import Mark from "./models/Mark.js";

await Promise.all([User.deleteMany({}),Student.deleteMany({}),Course.deleteMany({}),Batch.deleteMany({}),Attendance.deleteMany({}),Payment.deleteMany({}),Subject.deleteMany({}),Material.deleteMany({}),Assignment.deleteMany({}),Test.deleteMany({}),Mark.deleteMany({})]);

const admin=await User.create({name:"TuitionPro Admin",email:adminEmail,password:await bcrypt.hash(adminPassword,12),role:"admin"});
const studentUser=await User.create({name:"Rahul Kumar",email:studentEmail,password:await bcrypt.hash(studentPassword,12),role:"student"});

const c=await Course.create({name:"Information Technology",code:"IT",duration:"4 Years",fee:5000});
await Batch.create({name:"IT-A",course:c.name,schedule:"Mon-Wed-Fri 10:00 AM"});
const s=await Student.create({user:studentUser._id,studentCode:"STU2026001",name:"Rahul Kumar",email:studentEmail,phone:"9876543210",course:c.name,batch:"IT-A",monthlyFee:5000,status:"Active"});

for(const i of [0,1,2,3,4,5,6,7,8,9])
  await Attendance.create({student:s._id,date:new Date(Date.now()-i*86400000),status:i%5===0?"Absent":i%3===0?"Late":"Present",checkIn:i%3===0?"10:12":"09:55"});

await Payment.create({student:s._id,amount:5000,month:"September 2026",status:"Paid",method:"Demo",transactionId:"DEMO-TXN-001",receiptNo:"TP-DEMO-001",paidAt:new Date()});
await Payment.create({student:s._id,amount:5000,month:"October 2026",status:"Pending",method:"Demo",receiptNo:"TP-DEMO-002"});

// Seeding Phase 3: Subjects, Materials, Tests, Marks
const subj1 = await Subject.create({name: "Information Technology", code: "IT-101", description: "Basics of IT"});
const subj2 = await Subject.create({name: "Computer Science", code: "CS-201", description: "Basics of CS"});

await Material.create({subject: subj1._id, title: "React.js Crash Course", type: "YouTube", link: "https://www.youtube.com/watch?v=w7ejDZ8SWv8"});
await Material.create({subject: subj1._id, title: "MDN Web Docs", type: "Link", link: "https://developer.mozilla.org/"});
await Assignment.create({subject: subj1._id, title: "Build a Portfolio SPA", dueDate: new Date("2026-10-15"), status: "Pending"});

const tst1 = await Test.create({name: "Midterm 1", subject: subj1._id, batch: "IT-A", date: new Date("2026-09-15"), maxMarks: 100});
await Mark.create({test: tst1._id, student: s._id, marks: 85});

console.log("Seed complete"); await mongoose.disconnect();
