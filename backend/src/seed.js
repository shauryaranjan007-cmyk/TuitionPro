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

// ── Admin
const admin = await User.create({name:"TuitionPro Admin",email:adminEmail,password:await bcrypt.hash(adminPassword,12),role:"admin"});

// ── Courses: Class 8, 9, 10
const c8  = await Course.create({name:"Class 8",  code:"CLS8",  duration:"1 Year", fee:2500});
const c9  = await Course.create({name:"Class 9",  code:"CLS9",  duration:"1 Year", fee:3000});
const c10 = await Course.create({name:"Class 10", code:"CLS10", duration:"1 Year", fee:3500});

// ── Batches
const b8  = await Batch.create({name:"Class 8-A",  course:c8._id,  schedule:"Mon-Wed-Fri 08:00 AM"});
const b9  = await Batch.create({name:"Class 9-A",  course:c9._id,  schedule:"Mon-Wed-Fri 10:00 AM"});
const b10 = await Batch.create({name:"Class 10-A", course:c10._id, schedule:"Tue-Thu-Sat 09:00 AM"});

// ── Helpers
async function mkUser(name, email) {
  return User.create({name, email, password:await bcrypt.hash(studentPassword,12), role:"student"});
}
let codeNum = 1;
async function mkStudent(u, name, email, phone, course, batch, fee) {
  return Student.create({
    user: u._id,
    studentCode: `STU2026${String(codeNum++).padStart(3,"0")}`,
    name, email, phone, course: course._id, batch: batch._id, monthlyFee: fee, status:"Active"
  });
}
async function mkAttendance(studentId, days=10) {
  for (const i of Array.from({length:days},(_,i)=>i))
    await Attendance.create({student:studentId,date:new Date(Date.now()-i*86400000),status:i%5===0?"Absent":i%3===0?"Late":"Present",checkIn:i%3===0?"10:12":"09:55"});
}
async function mkPayments(studentId, fee) {
  await Payment.create({student:studentId,amount:fee,month:"September 2026",status:"Paid",  method:"UPI",transactionId:`TXN-${studentId}-001`,receiptNo:`TP-${studentId}-001`,paidAt:new Date()});
  await Payment.create({student:studentId,amount:fee,month:"October 2026",  status:"Pending",method:"Cash",receiptNo:`TP-${studentId}-002`});
}

// ── Class 8 Students (4 students)
const u8_1 = await mkUser("Aarav Sharma",   "aarav@tuitionpro.com");
const u8_2 = await mkUser("Priya Singh",    "priya@tuitionpro.com");
const u8_3 = await mkUser("Riya Gupta",     "riya@tuitionpro.com");
const u8_4 = await mkUser("Karan Mehta",    "karan@tuitionpro.com");

const s8_1 = await mkStudent(u8_1,"Aarav Sharma","aarav@tuitionpro.com","9876543201",c8,b8,2500);
const s8_2 = await mkStudent(u8_2,"Priya Singh",  "priya@tuitionpro.com","9876543202",c8,b8,2500);
const s8_3 = await mkStudent(u8_3,"Riya Gupta",   "riya@tuitionpro.com","9876543203",c8,b8,2500);
const s8_4 = await mkStudent(u8_4,"Karan Mehta",  "karan@tuitionpro.com","9876543204",c8,b8,2500);

for (const s of [s8_1,s8_2,s8_3,s8_4]) { await mkAttendance(s._id); await mkPayments(s._id,2500); }

// ── Class 9 Students (4 students)
const u9_1 = await mkUser("Ananya Verma",   "ananya@tuitionpro.com");
const u9_2 = await mkUser("Rohan Patel",    "rohan@tuitionpro.com");
const u9_3 = await mkUser("Sneha Joshi",    "sneha@tuitionpro.com");
const u9_4 = await mkUser("Dev Chauhan",    "dev@tuitionpro.com");

const s9_1 = await mkStudent(u9_1,"Ananya Verma","ananya@tuitionpro.com","9876543211",c9,b9,3000);
const s9_2 = await mkStudent(u9_2,"Rohan Patel", "rohan@tuitionpro.com","9876543212",c9,b9,3000);
const s9_3 = await mkStudent(u9_3,"Sneha Joshi", "sneha@tuitionpro.com","9876543213",c9,b9,3000);
const s9_4 = await mkStudent(u9_4,"Dev Chauhan", "dev@tuitionpro.com","9876543214",c9,b9,3000);

for (const s of [s9_1,s9_2,s9_3,s9_4]) { await mkAttendance(s._id); await mkPayments(s._id,3000); }

// ── Class 10 Students (4 students + 1 login student)
const u10_1 = await mkUser("Rahul Kumar",    studentEmail);
const u10_2 = await mkUser("Pooja Nair",     "pooja@tuitionpro.com");
const u10_3 = await mkUser("Arjun Kapoor",   "arjun@tuitionpro.com");
const u10_4 = await mkUser("Divya Reddy",    "divya@tuitionpro.com");

const s10_1 = await mkStudent(u10_1,"Rahul Kumar", studentEmail,        "9876543221",c10,b10,3500);
const s10_2 = await mkStudent(u10_2,"Pooja Nair",  "pooja@tuitionpro.com","9876543222",c10,b10,3500);
const s10_3 = await mkStudent(u10_3,"Arjun Kapoor","arjun@tuitionpro.com","9876543223",c10,b10,3500);
const s10_4 = await mkStudent(u10_4,"Divya Reddy", "divya@tuitionpro.com","9876543224",c10,b10,3500);

for (const s of [s10_1,s10_2,s10_3,s10_4]) { await mkAttendance(s._id); await mkPayments(s._id,3500); }

// ─────────────────────────────────────────────────────────────────
// SUBJECTS & STUDY MATERIALS
// ─────────────────────────────────────────────────────────────────

// ── Class 8 Subjects & Materials
const s8maths   = await Subject.create({name:"Class 8 Mathematics", code:"CLS8-MATH", description:"NCERT Class 8 Mathematics covering Algebra, Geometry and more"});
const s8science = await Subject.create({name:"Class 8 Science",     code:"CLS8-SCI",  description:"NCERT Class 8 Science covering Physics, Chemistry, Biology"});
const s8english = await Subject.create({name:"Class 8 English",     code:"CLS8-ENG",  description:"English Grammar and Literature for Class 8"});

await Material.create({subject:s8maths._id, title:"Class 8 Maths – Full Chapter NCERT (YouTube)", type:"YouTube", link:"https://www.youtube.com/playlist?list=PLmd2GEKBxl37CvvVaYOhQF_yFIy5T7WzL"});
await Material.create({subject:s8maths._id, title:"NCERT Class 8 Maths Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?hemh1=0-16"});
await Material.create({subject:s8maths._id, title:"Class 8 Maths Practice – Khan Academy", type:"Link", link:"https://www.khanacademy.org/math/algebra"});

await Material.create({subject:s8science._id, title:"Class 8 Science NCERT – Full Playlist", type:"YouTube", link:"https://www.youtube.com/playlist?list=PLmd2GEKBxl35pzRVGWQ-uajFBjEpEo7LH"});
await Material.create({subject:s8science._id, title:"NCERT Class 8 Science Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?hesc1=0-18"});

await Material.create({subject:s8english._id, title:"Class 8 English Grammar Lessons (YouTube)", type:"YouTube", link:"https://www.youtube.com/results?search_query=class+8+english+grammar"});
await Material.create({subject:s8english._id, title:"BBC Learning English – Grammar Reference", type:"Link", link:"https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate"});

// ── Class 9 Subjects & Materials
const s9maths   = await Subject.create({name:"Class 9 Mathematics", code:"CLS9-MATH", description:"NCERT Class 9 Maths: Number Systems, Polynomials, Geometry"});
const s9science = await Subject.create({name:"Class 9 Science",     code:"CLS9-SCI",  description:"NCERT Class 9 Science: Matter, Atoms, Forces, Life Processes"});
const s9sst     = await Subject.create({name:"Class 9 Social Studies", code:"CLS9-SST", description:"History, Geography, Economics & Political Science for Class 9"});

await Material.create({subject:s9maths._id, title:"Class 9 Maths NCERT – Full Course (YouTube)", type:"YouTube", link:"https://www.youtube.com/playlist?list=PLCSTGzFtUMq15dVVnpUyuITrF5gV2Qa82"});
await Material.create({subject:s9maths._id, title:"NCERT Class 9 Maths Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?iemh1=0-15"});
await Material.create({subject:s9maths._id, title:"Vedantu – Class 9 Maths Solved Examples", type:"Link", link:"https://www.vedantu.com/ncert/class-9-maths"});

await Material.create({subject:s9science._id, title:"Class 9 Science NCERT – All Chapters (YouTube)", type:"YouTube", link:"https://www.youtube.com/playlist?list=PLmd2GEKBxl36X3U9CVbz5bSL2CptBlQlK"});
await Material.create({subject:s9science._id, title:"NCERT Class 9 Science Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?iesc1=0-15"});

await Material.create({subject:s9sst._id, title:"Class 9 SST Complete Playlist (YouTube)", type:"YouTube", link:"https://www.youtube.com/results?search_query=class+9+social+science+ncert"});
await Material.create({subject:s9sst._id, title:"NCERT Class 9 History – India and the Contemporary World", type:"Link", link:"https://ncert.nic.in/textbook.php?iess2=0-5"});

// ── Class 10 Subjects & Materials
const s10maths   = await Subject.create({name:"Class 10 Mathematics", code:"CLS10-MATH", description:"NCERT Class 10 Maths: Real Numbers, Algebra, Trigonometry, Statistics"});
const s10science = await Subject.create({name:"Class 10 Science",     code:"CLS10-SCI",  description:"NCERT Class 10 Science: Chemical Reactions, Life Processes, Electricity"});
const s10sst     = await Subject.create({name:"Class 10 Social Studies", code:"CLS10-SST", description:"History, Geography, Economics & Civics for Class 10"});
const s10eng     = await Subject.create({name:"Class 10 English",     code:"CLS10-ENG",  description:"First Flight and Footprints Without Feet – NCERT Class 10"});

await Material.create({subject:s10maths._id, title:"Class 10 Maths NCERT – Complete Course (YouTube)", type:"YouTube", link:"https://www.youtube.com/playlist?list=PLCSTGzFtUMq21w0c3e4l1wU15NF9b5nJb"});
await Material.create({subject:s10maths._id, title:"NCERT Class 10 Maths Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?jemh1=0-15"});
await Material.create({subject:s10maths._id, title:"Class 10 Maths Previous Year Papers – CBSE", type:"Link", link:"https://www.cbse.gov.in/cbsenew/question-paper.html"});
await Material.create({subject:s10maths._id, title:"Toppr – Class 10 Maths Practice Questions", type:"Link", link:"https://www.toppr.com/guides/maths/class-10/"});

await Material.create({subject:s10science._id, title:"Class 10 Science NCERT – All Chapters (YouTube)", type:"YouTube", link:"https://www.youtube.com/playlist?list=PLCSTGzFtUMq0jvJeW8hWXL3f8sxuegGUd"});
await Material.create({subject:s10science._id, title:"NCERT Class 10 Science Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?jesc1=0-16"});
await Material.create({subject:s10science._id, title:"BYJU'S Class 10 Science Notes", type:"Link", link:"https://byjus.com/class-10-science/"});

await Material.create({subject:s10sst._id, title:"Class 10 SST Complete Playlist (YouTube)", type:"YouTube", link:"https://www.youtube.com/results?search_query=class+10+social+science+ncert+full"});
await Material.create({subject:s10sst._id, title:"NCERT Class 10 SST Textbooks", type:"Link", link:"https://ncert.nic.in/textbook.php?jess2=0-8"});

await Material.create({subject:s10eng._id, title:"Class 10 English First Flight – All Chapters (YouTube)", type:"YouTube", link:"https://www.youtube.com/results?search_query=class+10+english+first+flight+ncert"});
await Material.create({subject:s10eng._id, title:"NCERT Class 10 English Textbook PDF", type:"Link", link:"https://ncert.nic.in/textbook.php?jelo1=0-11"});

// ── Assignments
await Assignment.create({subject:s8maths._id,   title:"Linear Equations – Exercise Set 1",  dueDate:new Date("2026-11-10"), status:"Pending"});
await Assignment.create({subject:s8science._id, title:"Crop Production – Summary Notes",     dueDate:new Date("2026-11-12"), status:"Pending"});
await Assignment.create({subject:s9maths._id,   title:"Polynomials – Practice Problems",     dueDate:new Date("2026-11-08"), status:"Pending"});
await Assignment.create({subject:s9science._id, title:"Atoms & Molecules – Numericals",      dueDate:new Date("2026-11-14"), status:"Pending"});
await Assignment.create({subject:s10maths._id,  title:"Trigonometry – Identities Worksheet", dueDate:new Date("2026-11-05"), status:"Pending"});
await Assignment.create({subject:s10science._id,title:"Chemical Reactions – Lab Report",     dueDate:new Date("2026-11-07"), status:"Pending"});

// ── Tests & Marks for Class 10
const tst10math = await Test.create({name:"Class 10 Maths Midterm", subject:s10maths._id, batch:"Class 10-A", date:new Date("2026-10-01"), maxMarks:100});
const tst10sci  = await Test.create({name:"Class 10 Science Unit Test", subject:s10science._id, batch:"Class 10-A", date:new Date("2026-10-05"), maxMarks:50});
const tst9math  = await Test.create({name:"Class 9 Maths Unit Test", subject:s9maths._id, batch:"Class 9-A", date:new Date("2026-10-03"), maxMarks:100});

await Mark.create({test:tst10math._id, student:s10_1._id, marks:87});
await Mark.create({test:tst10math._id, student:s10_2._id, marks:91});
await Mark.create({test:tst10math._id, student:s10_3._id, marks:78});
await Mark.create({test:tst10math._id, student:s10_4._id, marks:84});

await Mark.create({test:tst10sci._id, student:s10_1._id, marks:42});
await Mark.create({test:tst10sci._id, student:s10_2._id, marks:45});
await Mark.create({test:tst10sci._id, student:s10_3._id, marks:38});
await Mark.create({test:tst10sci._id, student:s10_4._id, marks:40});

await Mark.create({test:tst9math._id, student:s9_1._id, marks:76});
await Mark.create({test:tst9math._id, student:s9_2._id, marks:83});
await Mark.create({test:tst9math._id, student:s9_3._id, marks:69});
await Mark.create({test:tst9math._id, student:s9_4._id, marks:88});

console.log("✅ Seed complete — Class 8, 9 & 10 students, batches, subjects and materials created.");
await mongoose.disconnect();
