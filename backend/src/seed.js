import dotenv from "dotenv"; import mongoose from "mongoose"; import bcrypt from "bcryptjs";
import User from "./models/User.js"; import Student from "./models/Student.js"; import Course from "./models/Course.js"; import Batch from "./models/Batch.js"; import Attendance from "./models/Attendance.js"; import Payment from "./models/Payment.js";
dotenv.config();

if(process.env.NODE_ENV==="production") throw new Error("Do not run the destructive seed script in production.");
if(!process.env.MONGO_URI) throw new Error("MONGO_URI is required.");

const adminEmail    = process.env.SEED_ADMIN_EMAIL    || "admin@tuitionpro.local";
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const studentEmail  = process.env.SEED_STUDENT_EMAIL  || "student@tuitionpro.local";
const studentPassword = process.env.SEED_STUDENT_PASSWORD;
if(!adminPassword||!studentPassword) throw new Error("Set SEED_ADMIN_PASSWORD and SEED_STUDENT_PASSWORD in .env before running seed.");

await mongoose.connect(process.env.MONGO_URI);
import Subject from "./models/Subject.js"; import Material from "./models/Material.js"; import Assignment from "./models/Assignment.js"; import Test from "./models/Test.js"; import Mark from "./models/Mark.js";

// Clear everything
await Promise.all([
  User.deleteMany({}), Student.deleteMany({}), Course.deleteMany({}),
  Batch.deleteMany({}), Attendance.deleteMany({}), Payment.deleteMany({}),
  Subject.deleteMany({}), Material.deleteMany({}), Assignment.deleteMany({}),
  Test.deleteMany({}), Mark.deleteMany({})
]);

// ── Admin
await User.create({name:"TuitionPro Admin", email:adminEmail, password:await bcrypt.hash(adminPassword,12), role:"admin"});

// ── Courses
const c8  = await Course.create({name:"Class 8",  code:"CLS8",  duration:"1 Year", fee:2500});
const c9  = await Course.create({name:"Class 9",  code:"CLS9",  duration:"1 Year", fee:3000});
const c10 = await Course.create({name:"Class 10", code:"CLS10", duration:"1 Year", fee:3500});

// ── Batches (no "A" suffix)
const b8  = await Batch.create({name:"Class 8",  course:c8._id,  schedule:"Mon-Wed-Fri 08:00 AM"});
const b9  = await Batch.create({name:"Class 9",  course:c9._id,  schedule:"Mon-Wed-Fri 10:00 AM"});
const b10 = await Batch.create({name:"Class 10", course:c10._id, schedule:"Tue-Thu-Sat 09:00 AM"});

// ── Counter
let code = 1;

// ── Create user + student record
async function mkStudent(name, email, phone, course, batch, fee, isLoginUser=false) {
  const u = await User.create({
    name, email,
    password: await bcrypt.hash(studentPassword, 12),
    role: "student"
  });
  return Student.create({
    user: u._id,
    studentCode: `STU2026${String(code++).padStart(3,"0")}`,
    name, email, phone,
    course: course._id, batch: batch._id,
    monthlyFee: fee, status: "Active"
  });
}

// ── Realistic varied attendance (30 days)
// profile: "excellent" ~95%, "good" ~80%, "average" ~65%, "poor" ~45%
async function mkAttendance(studentId, profile="good") {
  const rates = { excellent:0.95, good:0.80, average:0.65, poor:0.45 };
  const rate = rates[profile] || 0.80;
  for (let i = 0; i < 30; i++) {
    const r = Math.random();
    let status;
    if (r < rate)             status = "Present";
    else if (r < rate + 0.07) status = "Late";
    else                      status = "Absent";
    await Attendance.create({
      student: studentId,
      date: new Date(Date.now() - i * 86400000),
      status,
      checkIn: status === "Late" ? "10:20" : status === "Present" ? "09:55" : undefined
    });
  }
}

// ── Fee payments: vary months paid / pending / overdue
const MONTHS = ["July 2026","August 2026","September 2026","October 2026"];
async function mkPayments(studentId, fee, paidCount) {
  // paidCount = how many months are paid (1-4)
  for (let i = 0; i < MONTHS.length; i++) {
    const paid = i < paidCount;
    await Payment.create({
      student: studentId,
      amount: fee,
      month: MONTHS[i],
      status: paid ? "Paid" : "Pending",
      method: paid ? (i%2===0 ? "UPI" : "Cash") : "Cash",
      transactionId: paid ? `TXN-${studentId}-${i+1}` : undefined,
      receiptNo: `TP-${studentId}-${i+1}`,
      paidAt: paid ? new Date(Date.now() - (MONTHS.length-i)*30*86400000) : undefined
    });
  }
}

// ═══════════════════════════════════════════
// CLASS 8 — 10 students
// ═══════════════════════════════════════════
const cls8 = [
  {name:"Aarav Sharma",    email:"aarav@tuitionpro.com",   phone:"9811001001", att:"excellent", paid:4},
  {name:"Priya Singh",     email:"priya@tuitionpro.com",   phone:"9811001002", att:"good",      paid:4},
  {name:"Riya Gupta",      email:"riya@tuitionpro.com",    phone:"9811001003", att:"good",      paid:3},
  {name:"Karan Mehta",     email:"karan@tuitionpro.com",   phone:"9811001004", att:"average",   paid:3},
  {name:"Neha Jain",       email:"neha8@tuitionpro.com",   phone:"9811001005", att:"excellent", paid:4},
  {name:"Aditya Rao",      email:"aditya8@tuitionpro.com", phone:"9811001006", att:"poor",      paid:2},
  {name:"Siya Tiwari",     email:"siya@tuitionpro.com",    phone:"9811001007", att:"average",   paid:2},
  {name:"Rahul Bose",      email:"rahulb@tuitionpro.com",  phone:"9811001008", att:"good",      paid:4},
  {name:"Kavya Nair",      email:"kavya8@tuitionpro.com",  phone:"9811001009", att:"average",   paid:1},
  {name:"Aryan Kapoor",    email:"aryan8@tuitionpro.com",  phone:"9811001010", att:"poor",      paid:1},
];

const s8 = [];
for (const d of cls8) {
  const s = await mkStudent(d.name, d.email, d.phone, c8, b8, 2500);
  await mkAttendance(s._id, d.att);
  await mkPayments(s._id, 2500, d.paid);
  s8.push({student:s, ...d});
}

// ═══════════════════════════════════════════
// CLASS 9 — 10 students
// ═══════════════════════════════════════════
const cls9 = [
  {name:"Ananya Verma",    email:"ananya@tuitionpro.com",  phone:"9822002001", att:"excellent", paid:4},
  {name:"Rohan Patel",     email:"rohan@tuitionpro.com",   phone:"9822002002", att:"good",      paid:4},
  {name:"Sneha Joshi",     email:"sneha@tuitionpro.com",   phone:"9822002003", att:"excellent", paid:4},
  {name:"Dev Chauhan",     email:"dev@tuitionpro.com",     phone:"9822002004", att:"good",      paid:3},
  {name:"Kritika Singh",   email:"kritika@tuitionpro.com", phone:"9822002005", att:"good",      paid:3},
  {name:"Mohit Sharma",    email:"mohit9@tuitionpro.com",  phone:"9822002006", att:"average",   paid:2},
  {name:"Simran Kaur",     email:"simran@tuitionpro.com",  phone:"9822002007", att:"average",   paid:2},
  {name:"Yash Agarwal",    email:"yash9@tuitionpro.com",   phone:"9822002008", att:"poor",      paid:1},
  {name:"Trisha Das",      email:"trisha@tuitionpro.com",  phone:"9822002009", att:"good",      paid:3},
  {name:"Nikhil Reddy",    email:"nikhil9@tuitionpro.com", phone:"9822002010", att:"poor",      paid:1},
];

const s9 = [];
for (const d of cls9) {
  const s = await mkStudent(d.name, d.email, d.phone, c9, b9, 3000);
  await mkAttendance(s._id, d.att);
  await mkPayments(s._id, 3000, d.paid);
  s9.push({student:s, ...d});
}

// ═══════════════════════════════════════════
// CLASS 10 — 10 students (index 0 = login student)
// ═══════════════════════════════════════════
const cls10 = [
  {name:"Rahul Kumar",     email:studentEmail,             phone:"9833003001", att:"good",      paid:4},
  {name:"Pooja Nair",      email:"pooja@tuitionpro.com",   phone:"9833003002", att:"excellent", paid:4},
  {name:"Arjun Kapoor",    email:"arjun@tuitionpro.com",   phone:"9833003003", att:"excellent", paid:4},
  {name:"Divya Reddy",     email:"divya@tuitionpro.com",   phone:"9833003004", att:"good",      paid:3},
  {name:"Varun Sinha",     email:"varun@tuitionpro.com",   phone:"9833003005", att:"good",      paid:3},
  {name:"Muskan Sharma",   email:"muskan@tuitionpro.com",  phone:"9833003006", att:"average",   paid:2},
  {name:"Harsh Pandey",    email:"harsh10@tuitionpro.com", phone:"9833003007", att:"average",   paid:2},
  {name:"Aditi Mishra",    email:"aditi@tuitionpro.com",   phone:"9833003008", att:"poor",      paid:1},
  {name:"Tejas Bhatt",     email:"tejas@tuitionpro.com",   phone:"9833003009", att:"good",      paid:3},
  {name:"Sana Khan",       email:"sana@tuitionpro.com",    phone:"9833003010", att:"poor",      paid:1},
];

const s10 = [];
for (const d of cls10) {
  const s = await mkStudent(d.name, d.email, d.phone, c10, b10, 3500);
  await mkAttendance(s._id, d.att);
  await mkPayments(s._id, 3500, d.paid);
  s10.push({student:s, ...d});
}

// ═══════════════════════════════════════════
// SUBJECTS & MATERIALS
// ═══════════════════════════════════════════

// Class 8
const s8maths   = await Subject.create({name:"Class 8 Mathematics", code:"CLS8-MATH", description:"NCERT Class 8 Mathematics: Algebra, Geometry, Data Handling"});
const s8science = await Subject.create({name:"Class 8 Science",     code:"CLS8-SCI",  description:"NCERT Class 8 Science: Physics, Chemistry, Biology"});
const s8english = await Subject.create({name:"Class 8 English",     code:"CLS8-ENG",  description:"Honeydew & It So Happened – NCERT Class 8"});

await Material.create({subject:s8maths._id,   title:"Class 8 Maths NCERT – Full Course (YouTube)", type:"YouTube", link:"https://www.youtube.com/watch?v=OmJ-4B-mS-Y"});
await Material.create({subject:s8maths._id,   title:"NCERT Class 8 Maths Textbook PDF",             type:"Link",    link:"https://ncert.nic.in/textbook.php?hemh1=0-16"});
await Material.create({subject:s8maths._id,   title:"Khan Academy – Algebra Basics",                type:"Link",    link:"https://www.khanacademy.org/math/algebra"});
await Material.create({subject:s8science._id, title:"Class 8 Science NCERT – All Chapters (YouTube)", type:"YouTube",link:"https://www.youtube.com/watch?v=Y4lHkLqwDYs"});
await Material.create({subject:s8science._id, title:"NCERT Class 8 Science Textbook PDF",           type:"Link",    link:"https://ncert.nic.in/textbook.php?hesc1=0-18"});
await Material.create({subject:s8english._id, title:"Class 8 English Honeydew – Chapter Videos",   type:"YouTube", link:"https://www.youtube.com/watch?v=aFQFB5a0E7Y"});
await Material.create({subject:s8english._id, title:"BBC Learning English – Lower Intermediate",    type:"Link",    link:"https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate"});

// Class 9
const s9maths   = await Subject.create({name:"Class 9 Mathematics", code:"CLS9-MATH", description:"NCERT Class 9 Maths: Number Systems, Polynomials, Triangles"});
const s9science = await Subject.create({name:"Class 9 Science",     code:"CLS9-SCI",  description:"NCERT Class 9 Science: Matter, Atoms, Motion, Life Processes"});
const s9sst     = await Subject.create({name:"Class 9 Social Studies", code:"CLS9-SST", description:"History, Geography, Economics & Civics for Class 9"});

await Material.create({subject:s9maths._id,   title:"Class 9 Maths NCERT – Full Course (YouTube)", type:"YouTube", link:"https://www.youtube.com/watch?v=xkg7370CPEs"});
await Material.create({subject:s9maths._id,   title:"NCERT Class 9 Maths Textbook PDF",            type:"Link",    link:"https://ncert.nic.in/textbook.php?iemh1=0-15"});
await Material.create({subject:s9maths._id,   title:"Vedantu – Class 9 Maths Solved Examples",    type:"Link",    link:"https://www.vedantu.com/ncert/class-9-maths"});
await Material.create({subject:s9science._id, title:"Class 9 Science – All Chapters (YouTube)",   type:"YouTube", link:"https://www.youtube.com/watch?v=oufYoGjRrco"});
await Material.create({subject:s9science._id, title:"NCERT Class 9 Science Textbook PDF",          type:"Link",    link:"https://ncert.nic.in/textbook.php?iesc1=0-15"});
await Material.create({subject:s9sst._id,     title:"Class 9 SST – Complete Course (YouTube)",   type:"YouTube", link:"https://www.youtube.com/watch?v=6GaKSL_HXGM"});
await Material.create({subject:s9sst._id,     title:"NCERT Class 9 History – India & the World",  type:"Link",    link:"https://ncert.nic.in/textbook.php?iess2=0-5"});

// Class 10
const s10maths   = await Subject.create({name:"Class 10 Mathematics",    code:"CLS10-MATH", description:"NCERT Class 10: Real Numbers, Polynomials, Trigonometry, Statistics"});
const s10science = await Subject.create({name:"Class 10 Science",        code:"CLS10-SCI",  description:"NCERT Class 10: Chemical Reactions, Light, Life Processes, Electricity"});
const s10sst     = await Subject.create({name:"Class 10 Social Studies",  code:"CLS10-SST",  description:"History, Geography, Economics & Civics for Class 10"});
const s10eng     = await Subject.create({name:"Class 10 English",        code:"CLS10-ENG",  description:"First Flight & Footprints Without Feet – NCERT Class 10"});

await Material.create({subject:s10maths._id,   title:"Class 10 Maths – Complete Course (YouTube)",  type:"YouTube", link:"https://www.youtube.com/watch?v=Jq5SObMdnZ8"});
await Material.create({subject:s10maths._id,   title:"NCERT Class 10 Maths Textbook PDF",           type:"Link",    link:"https://ncert.nic.in/textbook.php?jemh1=0-15"});
await Material.create({subject:s10maths._id,   title:"CBSE Class 10 Previous Year Maths Papers",    type:"Link",    link:"https://www.cbse.gov.in/cbsenew/question-paper.html"});
await Material.create({subject:s10maths._id,   title:"Toppr – Class 10 Maths Practice",             type:"Link",    link:"https://www.toppr.com/guides/maths/class-10/"});
await Material.create({subject:s10science._id, title:"Class 10 Science – All Chapters (YouTube)",   type:"YouTube", link:"https://www.youtube.com/watch?v=RnFqFbBqhDk"});
await Material.create({subject:s10science._id, title:"NCERT Class 10 Science Textbook PDF",          type:"Link",    link:"https://ncert.nic.in/textbook.php?jesc1=0-16"});
await Material.create({subject:s10science._id, title:"BYJU'S Class 10 Science Notes",               type:"Link",    link:"https://byjus.com/class-10-science/"});
await Material.create({subject:s10sst._id,     title:"Class 10 SST – Full Course (YouTube)",        type:"YouTube", link:"https://www.youtube.com/watch?v=MdSFLjRKDzM"});
await Material.create({subject:s10sst._id,     title:"NCERT Class 10 SST Textbooks",                type:"Link",    link:"https://ncert.nic.in/textbook.php?jess2=0-8"});
await Material.create({subject:s10eng._id,     title:"Class 10 First Flight – All Chapters (YouTube)", type:"YouTube", link:"https://www.youtube.com/watch?v=4nTBzHJA0_w"});
await Material.create({subject:s10eng._id,     title:"NCERT Class 10 English Textbook PDF",         type:"Link",    link:"https://ncert.nic.in/textbook.php?jelo1=0-11"});

// ═══════════════════════════════════════════
// ASSIGNMENTS
// ═══════════════════════════════════════════
await Assignment.create({subject:s8maths._id,    title:"Linear Equations – Exercise Set 1",       dueDate:new Date("2026-11-10"), status:"Pending"});
await Assignment.create({subject:s8science._id,  title:"Microorganisms – Summary Notes",           dueDate:new Date("2026-11-12"), status:"Pending"});
await Assignment.create({subject:s9maths._id,    title:"Polynomials – Practice Problems",          dueDate:new Date("2026-11-08"), status:"Pending"});
await Assignment.create({subject:s9science._id,  title:"Atoms & Molecules – Numericals",           dueDate:new Date("2026-11-14"), status:"Pending"});
await Assignment.create({subject:s10maths._id,   title:"Trigonometry – Identities Worksheet",     dueDate:new Date("2026-11-05"), status:"Pending"});
await Assignment.create({subject:s10science._id, title:"Chemical Reactions – Balancing Equations", dueDate:new Date("2026-11-07"), status:"Pending"});
await Assignment.create({subject:s10eng._id,     title:"Letter Writing – Formal & Informal",       dueDate:new Date("2026-11-09"), status:"Pending"});

// ═══════════════════════════════════════════
// TESTS & MARKS — realistic varied scores
// ═══════════════════════════════════════════

// Class 8 Tests
const t8math = await Test.create({name:"Class 8 Maths Unit Test",   subject:s8maths._id,   batch:"Class 8",  date:new Date("2026-09-20"), maxMarks:100});
const t8sci  = await Test.create({name:"Class 8 Science Unit Test", subject:s8science._id, batch:"Class 8",  date:new Date("2026-09-25"), maxMarks:50});

// marks roughly correlated with attendance profile
const scores8 = [
  {math:88,sci:44},{math:82,sci:40},{math:79,sci:38},{math:65,sci:30},
  {math:91,sci:46},{math:45,sci:20},{math:60,sci:28},{math:85,sci:42},
  {math:55,sci:26},{math:40,sci:18}
];
for (let i=0; i<s8.length; i++) {
  await Mark.create({test:t8math._id, student:s8[i].student._id, marks:scores8[i].math});
  await Mark.create({test:t8sci._id,  student:s8[i].student._id, marks:scores8[i].sci});
}

// Class 9 Tests
const t9math = await Test.create({name:"Class 9 Maths Midterm",   subject:s9maths._id,   batch:"Class 9",  date:new Date("2026-09-18"), maxMarks:100});
const t9sci  = await Test.create({name:"Class 9 Science Midterm", subject:s9science._id, batch:"Class 9",  date:new Date("2026-09-22"), maxMarks:80});

const scores9 = [
  {math:93,sci:74},{math:87,sci:68},{math:90,sci:72},{math:80,sci:62},
  {math:78,sci:60},{math:62,sci:48},{math:66,sci:50},{math:48,sci:36},
  {math:75,sci:58},{math:44,sci:32}
];
for (let i=0; i<s9.length; i++) {
  await Mark.create({test:t9math._id, student:s9[i].student._id, marks:scores9[i].math});
  await Mark.create({test:t9sci._id,  student:s9[i].student._id, marks:scores9[i].sci});
}

// Class 10 Tests
const t10math = await Test.create({name:"Class 10 Maths Midterm",     subject:s10maths._id,   batch:"Class 10", date:new Date("2026-10-01"), maxMarks:100});
const t10sci  = await Test.create({name:"Class 10 Science Unit Test", subject:s10science._id, batch:"Class 10", date:new Date("2026-10-05"), maxMarks:80});
const t10eng  = await Test.create({name:"Class 10 English Test",      subject:s10eng._id,     batch:"Class 10", date:new Date("2026-10-08"), maxMarks:50});

const scores10 = [
  {math:87,sci:65,eng:44},{math:94,sci:78,eng:48},{math:96,sci:76,eng:47},
  {math:82,sci:68,eng:40},{math:80,sci:62,eng:38},{math:67,sci:50,eng:30},
  {math:70,sci:54,eng:33},{math:52,sci:40,eng:22},{math:78,sci:60,eng:36},
  {math:49,sci:35,eng:20}
];
for (let i=0; i<s10.length; i++) {
  await Mark.create({test:t10math._id, student:s10[i].student._id, marks:scores10[i].math});
  await Mark.create({test:t10sci._id,  student:s10[i].student._id, marks:scores10[i].sci});
  await Mark.create({test:t10eng._id,  student:s10[i].student._id, marks:scores10[i].eng});
}

console.log("✅ Seed complete — 30 students across Class 8, 9 & 10 with varied attendance, fees & test scores.");
await mongoose.disconnect();
