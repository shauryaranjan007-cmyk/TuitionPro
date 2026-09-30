import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import courseRoutes from "./routes/courses.js";
import batchRoutes from "./routes/batches.js";
import attendanceRoutes from "./routes/attendance.js";
import paymentRoutes from "./routes/payments.js";
import aiRoutes from "./routes/ai.js";
import gmailRoutes from "./routes/gmail.js";
import subjectRoutes from "./routes/subjects.js";
import testRoutes from "./routes/tests.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();
const app = express();

const allowedOrigins=(process.env.CLIENT_URL||"http://localhost:5173").split(",").map(x=>x.trim()).filter(Boolean);
app.use(helmet());
app.use(cors({
  origin:(origin,cb)=>{
    if(!origin || allowedOrigins.includes(origin)) return cb(null,true);
    return cb(new Error("CORS origin not allowed"));
  },
  credentials:true
}));
app.use(express.json({limit:"100kb"}));
app.disable("x-powered-by");

const authLimiter=rateLimit({windowMs:15*60*1000,max:20,standardHeaders:"draft-8",legacyHeaders:false,message:{message:"Too many authentication attempts. Please try again later."}});
const sensitiveLimiter=rateLimit({windowMs:15*60*1000,max:60,standardHeaders:"draft-8",legacyHeaders:false,message:{message:"Too many requests. Please try again later."}});

app.get("/api/health",(req,res)=>res.json({
  success:true,app:"TuitionPro Pro",message:"API is running",
  integrations:{
    ai:!!process.env.GEMINI_API_KEY,
    payments:!!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET),
    gmail:!!(process.env.GMAIL_USER&&process.env.GMAIL_APP_PASSWORD)
  }
}));

app.use("/api/auth",authLimiter,authRoutes);
app.use("/api/students",sensitiveLimiter,studentRoutes);
app.use("/api/courses",sensitiveLimiter,courseRoutes);
app.use("/api/batches",sensitiveLimiter,batchRoutes);
app.use("/api/attendance",sensitiveLimiter,attendanceRoutes);
app.use("/api/payments",sensitiveLimiter,paymentRoutes);
app.use("/api/ai",sensitiveLimiter,aiRoutes);
app.use("/api/gmail",sensitiveLimiter,gmailRoutes);
app.use("/api/subjects",sensitiveLimiter,subjectRoutes);
app.use("/api/tests",sensitiveLimiter,testRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if(!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");

mongoose.connect(process.env.MONGO_URI)
  .then(()=>app.listen(PORT,()=>console.log(`TuitionPro API running on http://localhost:${PORT}`)))
  .catch(err=>{ console.error("MongoDB connection failed:",err.message); process.exit(1); });
