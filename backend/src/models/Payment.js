import mongoose from "mongoose";
const schema=new mongoose.Schema({
 student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true},
 amount:{type:Number,required:true,min:1}, month:{type:String,required:true},
 status:{type:String,enum:["Paid","Pending","Failed","Refunded"],default:"Pending"},
 method:{type:String,enum:["Cash","UPI","Card","Razorpay","Demo"],default:"Demo"},
 transactionId:{type:String,default:""}, receiptNo:{type:String,default:""}, paidAt:{type:Date}
},{timestamps:true});
export default mongoose.model("Payment",schema);
