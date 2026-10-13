import express from "express";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Batch from "../models/Batch.js";
import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import {protect,adminOnly} from "../middleware/auth.js";
const r=express.Router();

async function ownStudentId(req){
  if(req.user.role==="admin") return null;
  const s=await Student.findOne({ $or: [{user:req.user.id}, {email:req.user.email}] }).select("_id");
  return s?String(s._id):null;
}

r.get("/",protect,async(req,res,next)=>{
 try{
  const q={};
  if(req.user.role==="admin"){
    if(req.query.student) q.student=req.query.student;
    if(req.query.subject) q.subject=req.query.subject;
    if(req.query.class || req.query.batch){
      const raw = req.query.class || req.query.batch;
      const num = String(raw).replace(/[^0-9]/g, '');
      if (num) {
        const batches = await Batch.find({ name: new RegExp(`Class\\s*${num}\\b`, 'i') }).select('_id');
        const stus = await Student.find({ batch: { $in: batches.map(b => b._id) } }).select('_id');
        q.student = { $in: stus.map(s => s._id) };
      }
    }
  }else{
    const id=await ownStudentId(req);
    if(!id)return res.json([]);
    q.student=id;
  }
  if(req.query.from||req.query.to){
    q.date={};
    if(req.query.from)q.date.$gte=new Date(req.query.from);
    if(req.query.to)q.date.$lte=new Date(req.query.to+"T23:59:59");
  }
  const records = await Attendance.find(q)
    .populate({
      path: "student",
      select: "name studentCode batch course",
      populate: { path: "batch course", select: "name code" }
    })
    .populate("subject", "name code")
    .sort({date:-1});
  res.json(records);
 }catch(e){next(e);}
});

r.get("/summary",protect,async(req,res,next)=>{
 try{
  const q={};
  if(req.user.role!=="admin"){
    const id=await ownStudentId(req);
    if(!id) return res.json({total:0,present:0,absent:0,late:0,excused:0,percentage:0});
    q.student=id;
  }else if(req.query.student){
    q.student=req.query.student;
  }else if(req.query.class || req.query.batch){
    const raw = req.query.class || req.query.batch;
    const num = String(raw).replace(/[^0-9]/g, '');
    if (num) {
      const batches = await Batch.find({ name: new RegExp(`Class\\s*${num}\\b`, 'i') }).select('_id');
      const stus = await Student.find({ batch: { $in: batches.map(b => b._id) } }).select('_id');
      q.student = { $in: stus.map(s => s._id) };
    }
  }
  const all=await Attendance.find(q);
  const total=all.length;
  const present=all.filter(x=>x.status==="Present"||x.status==="Late").length;
  const absent=all.filter(x=>x.status==="Absent").length;
  const late=all.filter(x=>x.status==="Late").length;
  const excused=all.filter(x=>x.status==="Excused").length;
  res.json({total,present,absent,late,excused,percentage:total?Math.round(present/total*100):0});
 }catch(e){next(e);}
});

r.get("/summary/:studentId",protect,async(req,res,next)=>{
 try{
  if(req.user.role!=="admin"){
    const own=await ownStudentId(req);
    if(!own || own!==String(req.params.studentId))
      return res.status(403).json({message:"You can only view your own attendance summary"});
  }
  const all=await Attendance.find({student:req.params.studentId});
  const total=all.length,present=all.filter(x=>x.status==="Present"||x.status==="Late").length;
  const absent=all.filter(x=>x.status==="Absent").length,late=all.filter(x=>x.status==="Late").length;
  res.json({total,present,absent,late,excused:all.filter(x=>x.status==="Excused").length,percentage:total?Math.round(present/total*100):0});
 }catch(e){next(e);}
});

r.post("/",protect,adminOnly,async(req,res,next)=>{
 try{
  const student=await Student.findById(req.body.student);
  if(!student)return res.status(404).json({message:"Student not found"});
  const query = { student: student._id, date: new Date(req.body.date) };
  if(req.body.subject) query.subject = req.body.subject;

  const update = {
    student: student._id,
    date: new Date(req.body.date),
    status: req.body.status,
    subject: req.body.subject || undefined,
    lectureTime: req.body.lectureTime || "",
    checkIn: req.body.checkIn || (req.body.status === "Late" ? "10:15" : req.body.status === "Present" ? (req.body.lectureTime || "09:55") : ""),
    note: req.body.note || ""
  };

  const x=await Attendance.findOneAndUpdate(
    query,
    update,
    {upsert:true,new:true,setDefaultsOnInsert:true,runValidators:true}
  );
  res.status(201).json(x);
 }catch(e){next(e);}
});

r.post("/bulk",protect,adminOnly,async(req,res,next)=>{
 try{
  const { students, date, status, subject, lectureTime, note } = req.body;
  if(!Array.isArray(students) || students.length===0) {
    return res.status(400).json({ message: "List of students is required" });
  }
  const d = new Date(date);
  const results = await Promise.all(students.map(async (sid) => {
    const q = { student: sid, date: d };
    if(subject) q.subject = subject;
    return Attendance.findOneAndUpdate(
      q,
      {
        student: sid,
        date: d,
        status: status || "Present",
        subject: subject || undefined,
        lectureTime: lectureTime || "",
        checkIn: status === "Late" ? "10:15" : status === "Present" ? (lectureTime || "09:55") : "",
        note: note || ""
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }));
  res.status(201).json({ count: results.length, records: results });
 }catch(e){next(e);}
});

r.put("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const { student, date, status, subject, lectureTime, checkIn, note } = req.body;
  const body = {};
  if (student !== undefined) body.student = student;
  if (date !== undefined) body.date = new Date(date);
  if (status !== undefined) body.status = status;
  if (subject !== undefined) body.subject = subject;
  if (lectureTime !== undefined) body.lectureTime = lectureTime;
  if (checkIn !== undefined) body.checkIn = checkIn;
  if (note !== undefined) body.note = note;
  const x=await Attendance.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});
  if(!x)return res.status(404).json({message:"Attendance record not found"});
  res.json(x);
 }catch(e){next(e);}
r.delete("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const x=await Attendance.findByIdAndDelete(req.params.id);
  if(!x)return res.status(404).json({message:"Attendance record not found"});
  res.json(x);
 }catch(e){next(e);}
});
export default r;
