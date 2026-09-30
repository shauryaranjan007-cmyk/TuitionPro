import express from "express";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";
import {protect,adminOnly} from "../middleware/auth.js";
import {createOrder,verifySignature} from "../services/paymentService.js";
const r=express.Router();

async function ownStudent(req,studentId){
  if(req.user.role==="admin") return true;
  return !!await Student.exists({_id:studentId,user:req.user.id});
}

r.get("/",protect,async(req,res,next)=>{
 try{
  const q=req.user.role==="admin" ? {} : {student:await Student.findOne({user:req.user.id}).select("_id")};
  if(req.user.role!=="admin" && !q.student)return res.json([]);
  res.json(await Payment.find(q).populate("student","name studentCode").sort({createdAt:-1}));
 }catch(e){next(e);}
});

r.get("/summary",protect,async(req,res,next)=>{
 try{
  let q={};
  if(req.user.role!=="admin"){
    const s=await Student.findOne({user:req.user.id}).select("_id");
    if(!s)return res.json({total:0,paid:0,pending:0,count:0});
    q.student=s._id;
  }
  const rows=await Payment.find(q);
  const total=rows.reduce((s,x)=>s+x.amount,0);
  res.json({total,paid:rows.filter(x=>x.status==="Paid").reduce((s,x)=>s+x.amount,0),pending:rows.filter(x=>x.status==="Pending").reduce((s,x)=>s+x.amount,0),count:rows.length});
 }catch(e){next(e);}
});

r.post("/order",protect,async(req,res,next)=>{
 try{
  const {studentId,amount,month}=req.body;
  if(!studentId||!Number.isFinite(Number(amount))||Number(amount)<=0||Number(amount)>10000000||!month)
    return res.status(400).json({message:"Valid student, amount and month are required"});
  if(!(await ownStudent(req,studentId)))return res.status(403).json({message:"You can only create a payment order for your own account"});
  const student=await Student.findById(studentId);
  if(!student)return res.status(404).json({message:"Student not found"});
  const order=await createOrder(Number(amount),"tuition_"+Date.now());
  
  await Payment.create({
    student: studentId,
    amount: Number(amount),
    month,
    status: "Pending",
    method: order.mode === "demo" ? "Demo" : "Razorpay",
    transactionId: order.id
  });

  res.json({...order,studentId,month,mode:order.mode||"live"});
 }catch(e){next(e);}
});

r.post("/record",protect,adminOnly,async(req,res,next)=>{
 try{
  const { student, amount, month, status, method, transactionId } = req.body;
  if (!student || !amount || !month) return res.status(400).json({message:"Student, amount, and month are required"});
  
  const resolvedMethod = method || "Demo";
  if (process.env.NODE_ENV === "production" && resolvedMethod === "Demo") {
    return res.status(400).json({message:"Demo payment method is disabled in production"});
  }

  const p=await Payment.create({
    student, 
    amount: Number(amount), 
    month, 
    status: status || "Pending", 
    method: resolvedMethod, 
    transactionId, 
    receiptNo:"TP-"+Date.now(), 
    paidAt:status==="Paid"?new Date():undefined
  });
  res.status(201).json(p);
 }catch(e){next(e);}
});

r.post("/verify",protect,async(req,res,next)=>{
 try{
  const {orderId,paymentId,signature}=req.body;
  if(!orderId||!paymentId||!signature)return res.status(400).json({message:"Payment verification fields are required"});
  
  const payment = await Payment.findOne({ transactionId: orderId });
  if (!payment) return res.status(404).json({ message: "Payment order not found" });
  if (!(await ownStudent(req, payment.student))) return res.status(403).json({ message: "Not authorized for this payment" });

  if(!verifySignature(orderId,paymentId,signature))return res.status(400).json({message:"Payment signature invalid"});
  
  payment.status = "Paid";
  payment.paidAt = new Date();
  payment.receiptNo = "TP-" + Date.now();
  await payment.save();

  res.json({verified:true});
 }catch(e){next(e);}
});

r.post("/generate",protect,adminOnly,async(req,res,next)=>{
 try{
  const { month } = req.body;
  if(!month) return res.status(400).json({message: "Month is required"});

  const students = await Student.find({ status: "Active" });
  let generated = 0;
  for (const s of students) {
    const existing = await Payment.findOne({ student: s._id, month });
    if (!existing) {
      await Payment.create({
        student: s._id,
        amount: s.monthlyFee || 0,
        month,
        status: "Pending",
        method: "Offline"
      });
      generated++;
    }
  }
  res.json({ message: `Generated ${generated} pending payments for ${month}`, generated });
 }catch(e){next(e);}
});

r.put("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const { student, amount, month, status, method, transactionId } = req.body;
  
  const existingPayment = await Payment.findById(req.params.id);
  if (!existingPayment) return res.status(404).json({message:"Payment not found"});

  const resolvedMethod = method !== undefined ? method : existingPayment.method;
  if (process.env.NODE_ENV === "production" && resolvedMethod === "Demo") {
    return res.status(400).json({message:"Demo payment method is disabled in production"});
  }

  const updateData = {};
  if (student !== undefined) updateData.student = student;
  if (amount !== undefined) updateData.amount = Number(amount);
  if (month !== undefined) updateData.month = month;
  if (status !== undefined) {
    updateData.status = status;
    if (status === "Paid" && existingPayment.status !== "Paid") {
      updateData.paidAt = new Date();
      updateData.receiptNo = "TP-" + Date.now();
    }
  }
  if (method !== undefined) updateData.method = method;
  if (transactionId !== undefined) updateData.transactionId = transactionId;

  const x=await Payment.findByIdAndUpdate(req.params.id,updateData,{new:true,runValidators:true});
  res.json(x);
 }catch(e){next(e);}
});

r.delete("/:id",protect,adminOnly,async(req,res,next)=>{
 try{
  const x=await Payment.findByIdAndDelete(req.params.id);
  if(!x)return res.status(404).json({message:"Payment not found"});
  res.json(x);
 }catch(e){next(e);}
});
export default r;
