import mongoose from "mongoose";
const schema=new mongoose.Schema({
  name:{type:String,required:true}, email:{type:String,required:true,unique:true,lowercase:true},
  password:{type:String,required:true}, role:{type:String,enum:["admin","student"],default:"student"},
  mobile:{type:String,default:""}, dob:{type:Date}
},{timestamps:true});
export default mongoose.model("User",schema);
