import express from "express"; import Batch from "../models/Batch.js"; import {protect,adminOnly} from "../middleware/auth.js";
const r=express.Router();
r.get("/",protect,async(req,res,next)=>{try{res.json(await Batch.find().sort({name:1}));}catch(e){next(e);}});
r.post("/",protect,adminOnly,async(req,res,next)=>{
 try{
  const { name, course, schedule } = req.body;
  if(!name) return res.status(400).json({message:"Name is required"});
  const body = { name };
  if (course !== undefined) body.course = course;
  if (schedule !== undefined) body.schedule = schedule;
  res.status(201).json(await Batch.create(body));
 }catch(e){next(e);}
});
r.put("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const { name, course, schedule } = req.body;
  const body = {};
  if (name !== undefined) body.name = name;
  if (course !== undefined) body.course = course;
  if (schedule !== undefined) body.schedule = schedule;
  const x=await Batch.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});
  if(!x)return res.status(404).json({message:"Batch not found"});
  res.json(x);
 }catch(e){next(e);}
});
r.delete("/:id",protect,adminOnly,async(req,res,next)=>{try{const x=await Batch.findByIdAndDelete(req.params.id);if(!x)return res.status(404).json({message:"Batch not found"});res.json(x);}catch(e){next(e);}});
export default r;
