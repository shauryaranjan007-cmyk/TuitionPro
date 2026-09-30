import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router=express.Router();
const token=u=>jwt.sign(
  {id:u._id.toString(),role:u.role,name:u.name,email:u.email},
  process.env.JWT_SECRET,
  {expiresIn:"1d"}
);

const cookieOptions = () => ({
  httpOnly:true,
  secure:process.env.NODE_ENV==="production",
  sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
  maxAge:24*60*60*1000,
  path:"/"
});

function publicUser(u){
  return {id:u._id,name:u.name,email:u.email,role:u.role,mobile:u.mobile,dob:u.dob};
}

router.post("/register",async(req,res,next)=>{
 try{
  const name=String(req.body.name||"").trim();
  const email=String(req.body.email||"").trim().toLowerCase();
  const password=String(req.body.password||"");
  const mobile=String(req.body.mobile||"").trim();
  const dob=req.body.dob ? new Date(req.body.dob) : null;
  
  if(name.length<2||name.length>80) return res.status(400).json({message:"Name must be 2-80 characters"});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({message:"Valid email required"});
  if(!/^\d{10}$/.test(mobile)) return res.status(400).json({message:"Valid 10-digit mobile number required"});
  if(!dob || isNaN(dob.getTime()) || dob > new Date() || (new Date().getFullYear() - dob.getFullYear() < 5)) return res.status(400).json({message:"Valid date of birth required (age >= 5)"});
  if(password.length<8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return res.status(400).json({message:"Password must contain at least 8 characters, including a letter and a number"});
  if(await User.findOne({email})) return res.status(409).json({message:"Email already registered"});
  const u=await User.create({name,email,password:await bcrypt.hash(password,12),role:"student",mobile,dob});
  res.cookie("tp_token",token(u),cookieOptions());
  res.status(201).json({user:publicUser(u)});
 }catch(e){next(e);}
});

router.post("/login",async(req,res,next)=>{
 try{
  const email=String(req.body.email||"").trim().toLowerCase();
  const password=String(req.body.password||"");
  const u=await User.findOne({email});
  if(!u||!(await bcrypt.compare(password,u.password))) return res.status(401).json({message:"Invalid email or password"});
  res.cookie("tp_token",token(u),cookieOptions());
  res.json({user:publicUser(u)});
 }catch(e){next(e);}
});

router.post("/logout",(req,res)=>{
 res.clearCookie("tp_token",{
  httpOnly:true,
  secure:process.env.NODE_ENV==="production",
  sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
  path:"/"
 });
 res.json({message:"Logged out"});
});

router.get("/me",protect,async(req,res,next)=>{
 try{
  const u=await User.findById(req.user.id).select("_id name email role");
  if(!u) return res.status(401).json({message:"User account not found"});
  res.json({user:publicUser(u)});
 }catch(e){next(e);}
});

router.put("/me",protect,async(req,res,next)=>{
 try{
  const u=await User.findById(req.user.id);
  if(!u) return res.status(404).json({message:"User not found"});
  if(req.body.name) u.name = String(req.body.name).trim();
  if(req.body.password) {
    if(req.body.password.length<8) return res.status(400).json({message:"Password must be at least 8 characters"});
    u.password = await bcrypt.hash(req.body.password,12);
  }
  await u.save();
  res.cookie("tp_token",token(u),cookieOptions());
  res.json({user:publicUser(u)});
 }catch(e){next(e);}
});

export default router;
