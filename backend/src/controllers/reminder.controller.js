import { createReminder,getuserReminders } from "../Services/reminder.services.js";

export const createReminders = async (req, res) => {
    try {
      const reminder = await createReminder(
        {
          task:req.body.task,
          datetime:req.body.datetime,
          userId:req.id
        }
      );
      res.status(201).json(reminder);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Failed to create reminder" });
    }
  };

export const getReminders =async(req,res)=>{
  try{
    const{date,range,search,label,status,priority}=req.query;
      const reminders=await getuserReminders(req.id,{ date,
        range,
        search,
        label,
        status,
        priority,});
      res.status(200).json({
        success:true,
        data:reminders,
      }
      )
  }
  catch(error){
    res.status(500).json({success:false,message:error.message});
  }
}