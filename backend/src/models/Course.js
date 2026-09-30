import mongoose from "mongoose";
const schema=new mongoose.Schema({name:{type:String,required:true},code:{type:String,required:true,unique:true},duration:{type:String,default:"6 Months"},fee:{type:Number,default:5000}},{timestamps:true});
export default mongoose.model("Course",schema);
