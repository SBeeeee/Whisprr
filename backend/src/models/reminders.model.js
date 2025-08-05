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
});

export default mongoose.model("Reminder", reminderSchema);
