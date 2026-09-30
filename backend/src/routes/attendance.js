import express from "express";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import {protect,adminOnly} from "../middleware/auth.js";
const r=express.Router();

async function ownStudentId(req){
  if(req.user.role==="admin") return null;
  const s=await Student.findOne({user:req.user.id}).select("_id");
  return s?String(s._id):null;
}

r.get("/",protect,async(req,res,next)=>{
 try{
  const q={};
  if(req.user.role==="admin"){
    if(req.query.student)q.student=req.query.student;
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
  res.json(await Attendance.find(q).populate("student","name studentCode").sort({date:-1}));
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
  const x=await Attendance.findOneAndUpdate(
    {student:student._id,date:new Date(req.body.date)},
    {student:student._id,date:new Date(req.body.date),status:req.body.status,checkIn:req.body.checkIn||"",note:req.body.note||""},
    {upsert:true,new:true,setDefaultsOnInsert:true,runValidators:true}
  );
  res.status(201).json(x);
 }catch(e){next(e);}
});

r.put("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const { student, date, status, checkIn, note } = req.body;
  const body = {};
  if (student !== undefined) body.student = student;
  if (date !== undefined) body.date = new Date(date);
  if (status !== undefined) body.status = status;
  if (checkIn !== undefined) body.checkIn = checkIn;
  if (note !== undefined) body.note = note;
  const x=await Attendance.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});
  if(!x)return res.status(404).json({message:"Attendance record not found"});
  res.json(x);
 }catch(e){next(e);}
});

r.delete("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const x=await Attendance.findByIdAndDelete(req.params.id);
  if(!x)return res.status(404).json({message:"Attendance record not found"});
  res.json(x);
 }catch(e){next(e);}
});
export default r;
