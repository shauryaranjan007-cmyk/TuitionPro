import mongoose from "mongoose";
const schema=new mongoose.Schema({name:{type:String,required:true},course:{type:mongoose.Schema.Types.ObjectId,ref:"Course"},schedule:{type:String,default:""}},{timestamps:true});
export default mongoose.model("Batch",schema);
