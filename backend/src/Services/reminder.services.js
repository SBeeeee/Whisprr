import Reminder from "../models/reminders.model.js";
import User from "../models/Users.models.js"


export const createReminder =async({ task, datetime, userId}) =>{
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");


    const reminder = new Reminder({ task, datetime, phoneNumber:user.phone,user:user.id });
    await reminder.save();

    user.reminders.push(reminder._id);
  await user.save();
    return reminder;
}

export const getRemindersToTrigger = async () => {
    const now = new Date();
    const target = new Date(now.getTime() + 10 * 60 * 1000);
  
    return await Reminder.find({
      datetime: { $lte: target },
      reminded: false,
    });
  };


export const markAsReminded = async (id) => {
    await Reminder.findByIdAndUpdate(id, { reminded: true });
  };

export const getuserReminders =async(userId)=>{
  return Reminder.find({user:userId}).sort({datetime:1});
}