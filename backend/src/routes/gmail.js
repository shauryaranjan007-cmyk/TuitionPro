import express from "express"; import {adminOnly,protect} from "../middleware/auth.js"; import {sendMail,gmailEnabled} from "../services/gmailService.js";
const r=express.Router();
r.get("/status",protect,adminOnly,(req,res)=>res.json({enabled:gmailEnabled(),mode:gmailEnabled()?"gmail":"demo"}));
r.post("/send",protect,adminOnly,async(req,res,next)=>{
 const {to,subject,text}=req.body;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(to||""))||!String(subject||"").trim()||!String(text||"").trim())
   return res.status(400).json({message:"Valid recipient, subject and message are required"});
 try{res.json(await sendMail({to:String(to).trim(),subject:String(subject).trim().slice(0,200),text:String(text).trim().slice(0,10000)}));}catch(e){next(e);}
});
export default r;
