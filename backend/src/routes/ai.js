import express from "express"; import {protect} from "../middleware/auth.js"; import {askAI} from "../services/aiService.js";
const r=express.Router();
r.post("/ask",protect,async(req,res,next)=>{
 const question=String(req.body.question||"").trim();
 if(!question)return res.status(400).json({message:"Question required"});
 if(question.length>2000)return res.status(400).json({message:"Question is too long"});
 try{res.json({answer:await askAI(question, req.user),provider:process.env.GEMINI_API_KEY?"Gemini":"Local fallback"});}catch(e){next(e);}
});
export default r;
