import Student from "../models/Student.js";
import Payment from "../models/Payment.js";
import Attendance from "../models/Attendance.js";

async function getAdminContext() {
  const [studentsCount, pendingPayments, thisMonthCollection, attendances] = await Promise.all([
    Student.countDocuments({ status: "Active" }),
    Payment.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Payment.aggregate([{ $match: { status: "Paid", paidAt: { $gte: new Date(new Date().setDate(1)) } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Attendance.aggregate([
      { $group: { _id: "$student", total: { $sum: 1 }, present: { $sum: { $cond: [ { $in: ["$status", ["Present", "Late"]] }, 1, 0 ] } } } },
      { $project: { attendanceRatio: { $divide: ["$present", "$total"] } } },
      { $match: { attendanceRatio: { $lt: 0.75 } } }
    ])
  ]);
  
  const pendingTotal = pendingPayments[0]?.total || 0;
  const collectionTotal = thisMonthCollection[0]?.total || 0;
  
  let lowAttendanceContext = "";
  if (attendances.length > 0) {
    const sIds = attendances.map(a => a._id);
    const lowStudents = await Student.find({ _id: { $in: sIds } }).select("name");
    lowAttendanceContext = `\\n- Low Attendance Students (<75%): ` + lowStudents.map(s => s.name).join(", ");
  }

  return `System Context (Admin):
- Active Students: ${studentsCount}
- Total Pending Fees: Rs. ${pendingTotal}
- This Month's Collection: Rs. ${collectionTotal}${lowAttendanceContext}`;
}

async function getStudentContext(userId) {
  const student = await Student.findOne({ user: userId });
  if (!student) return "System Context (Student): No student record found.";
  
  const [payments, attendances] = await Promise.all([
    Payment.find({ student: student._id }),
    Attendance.find({ student: student._id })
  ]);
  
  const pendingTotal = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const presentCount = attendances.filter(a => a.status === "Present" || a.status === "Late").length;
  
  return `System Context (Student ${student.name}):
- Course: ${student.course || "N/A"}
- Total Pending Fees: Rs. ${pendingTotal}
- Total Present/Late Days: ${presentCount} / ${attendances.length}`;
}

export async function askAI(question, user) {
 const key=process.env.GEMINI_API_KEY;
 
 let context = "";
 if (user.role === "admin") {
   context = await getAdminContext();
 } else {
   context = await getStudentContext(user.id);
 }

 const fullPrompt = `You are the TuitionPro academic management assistant. Answer clearly and briefly based on the following real-time data.\n\n${context}\n\nQuestion: ${question}`;

 if(!key) return localAnswer(question, context);
 try{
  const {GoogleGenerativeAI}=await import("@google/generative-ai");
  const genAI=new GoogleGenerativeAI(key);
  const model=genAI.getGenerativeModel({model:"gemini-2.0-flash"});
  const result=await model.generateContent(fullPrompt);
  return result.response.text();
 }catch(e){
  console.warn("AI provider unavailable; using fallback:",e.message);
  return localAnswer(question, context);
 }
}

function localAnswer(q, context){
 const x=q.toLowerCase();
 if(x.includes("attendance"))return context + "\\nTuitionPro calculates attendance as (Present + Late) / total recorded sessions × 100.";
 if(x.includes("payment")||x.includes("fee")||x.includes("dues"))return context;
 return context + "\\nI can help with students, attendance, fees, and more.";
}
