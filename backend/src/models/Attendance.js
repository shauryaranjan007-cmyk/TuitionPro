import mongoose from "mongoose";
const schema=new mongoose.Schema({
 student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true},
 date:{type:Date,required:true}, status:{type:String,enum:["Present","Absent","Late","Excused"],required:true},
 subject:{type:mongoose.Schema.Types.ObjectId,ref:"Subject"},
 lectureTime:{type:String,default:""},
 checkIn:{type:String,default:""}, note:{type:String,default:""}
},{timestamps:true});
schema.index({student:1,date:1,subject:1});
export default mongoose.model("Attendance",schema);
