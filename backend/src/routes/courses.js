import express from "express"; import Course from "../models/Course.js"; import {protect,adminOnly} from "../middleware/auth.js";
const r=express.Router();
r.get("/",protect,async(req,res,next)=>{try{res.json(await Course.find().sort({name:1}));}catch(e){next(e);}});
r.post("/",protect,adminOnly,async(req,res,next)=>{
 try{
  const { name, code, duration, fee } = req.body;
  if(!name || !code) return res.status(400).json({message:"Name and code are required"});
  const body = { name, code };
  if (duration !== undefined) body.duration = duration;
  if (fee !== undefined) body.fee = Number(fee);
  res.status(201).json(await Course.create(body));
 }catch(e){next(e);}
});
r.put("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const { name, code, duration, fee } = req.body;
  const body = {};
  if (name !== undefined) body.name = name;
  if (code !== undefined) body.code = code;
  if (duration !== undefined) body.duration = duration;
  if (fee !== undefined) body.fee = Number(fee);
  const x=await Course.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});
  if(!x)return res.status(404).json({message:"Course not found"});
  res.json(x);
 }catch(e){next(e);}
});
r.delete("/:id",protect,adminOnly,async(req,res,next)=>{try{const x=await Course.findByIdAndDelete(req.params.id);if(!x)return res.status(404).json({message:"Course not found"});res.json(x);}catch(e){next(e);}});
export default r;
