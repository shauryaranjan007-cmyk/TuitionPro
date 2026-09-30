import mongoose from "mongoose";
const schema=new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",unique:true,sparse:true,index:true},
 studentCode:{type:String,required:[true, "Student code is required"],unique:true,trim:true,match:[/^[A-Z0-9_-]{3,30}$/, "Invalid student code format"]},
 name:{type:String,required:[true, "Name is required"],trim:true,minlength:[2, "Name must be at least 2 characters"],maxlength:80},
 email:{type:String,required:[true, "Email is required"],lowercase:true,trim:true,match:[/^\S+@\S+\.\S+$/, "Please provide a valid email address"]},
 phone:{type:String,default:"",trim:true,match:[/^\d{0,15}$/, "Phone number must contain only digits"]},
 course:{type:mongoose.Schema.Types.ObjectId,ref:"Course"},
 batch:{type:mongoose.Schema.Types.ObjectId,ref:"Batch"},
 monthlyFee:{type:Number,default:5000,min:[0, "Fee cannot be negative"],max:10000000},
 status:{type:String,enum:{values:["Active","Inactive"],message:"{VALUE} is not a valid status"},default:"Active"}
},{timestamps:true});

// Experiment 6: Mongoose Indexing Examples
// 1. Compound index on batch and studentCode for faster combined queries
schema.index({ batch: 1, studentCode: 1 });
// 2. Index on batch and status to optimize filtering active students in a batch
schema.index({ batch: 1, status: 1 });
// 3. Text index on name for fast search
schema.index({ name: 'text' });

export default mongoose.model("Student",schema);
