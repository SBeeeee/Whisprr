import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  task: {
    type:String,
    required:true
  },
  datetime: {
    type:Date,
    required:true,
  },
  phoneNumber:{
    type:String,
    required:true,
  },
  reminded: { 
    type: Boolean, default: false 
},
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
},{ timestamps: true });

export default mongoose.model("Reminder", reminderSchema);
