import express from "express";
import Student from "../models/Student.js";
import {protect,adminOnly} from "../middleware/auth.js";
import Payment from "../models/Payment.js";
import Attendance from "../models/Attendance.js";
const r=express.Router();

r.get("/",protect,async(req,res,next)=>{
 try{
  const q=req.user.role==="admin" ? {} : {user:req.user.id};
  res.json(await Student.find(q).populate('course', 'name').populate('batch', 'name').sort({createdAt:-1}));
 }catch(e){next(e);}
});

r.get("/:id",protect,async(req,res,next)=>{
 try{
  const x=await Student.findById(req.params.id).populate('course', 'name').populate('batch', 'name');
  if(!x)return res.status(404).json({message:"Student not found"});
  if(req.user.role!=="admin" && String(x.user)!==String(req.user.id))
    return res.status(403).json({message:"You can only access your own student profile"});
  res.json(x);
 }catch(e){next(e);}
});

r.post("/",protect,adminOnly,async(req,res,next)=>{
 try{
  const { studentCode, name, email, phone, course, batch, monthlyFee, status } = req.body;
  if(!studentCode || !name || !email) return res.status(400).json({message:"studentCode, name, and email are required"});
  
  const body = { studentCode, name, email: String(email).trim().toLowerCase() };
  if(phone !== undefined) body.phone = phone;
  if(course !== undefined) body.course = course;
  if(batch !== undefined) body.batch = batch;
  if(monthlyFee !== undefined) body.monthlyFee = Number(monthlyFee);
  if(status !== undefined) body.status = status;

  const x=await Student.create(body);
  res.status(201).json(x);
 }catch(e){next(e);}
});

r.put("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const { studentCode, name, email, phone, course, batch, monthlyFee, status } = req.body;
  const body = {};
  if(studentCode !== undefined) body.studentCode = studentCode;
  if(name !== undefined) body.name = name;
  if(email !== undefined) body.email = String(email).trim().toLowerCase();
  if(phone !== undefined) body.phone = phone;
  if(course !== undefined) body.course = course;
  if(batch !== undefined) body.batch = batch;
  if(monthlyFee !== undefined) body.monthlyFee = Number(monthlyFee);
  if(status !== undefined) body.status = status;

  const x=await Student.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});
  if(!x)return res.status(404).json({message:"Student not found"});
  res.json(x);
 }catch(e){next(e);}
});

r.delete("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const payments = await Payment.countDocuments({ student: req.params.id });
  if (payments > 0) {
    return res.status(400).json({ message: "Cannot delete student with existing payments. Please deactivate the student instead." });
  }

  await Attendance.deleteMany({ student: req.params.id });

  const x=await Student.findByIdAndDelete(req.params.id);
  if(!x)return res.status(404).json({message:"Student not found"});
  res.json({message:"Student and related records deleted"});
 }catch(e){next(e);}
});
export default r;
