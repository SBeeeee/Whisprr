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

export const getuserReminders =async(userId,filters)=>{
  const query = { user: userId };
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  if(filters.date === "today" || filters.range === "today"){
    query.datetime = { $gte: startOfDay, $lte: endOfDay };
  }
  if(filters.range === "past"){
    query.datetime = { $lt: startOfDay };
  }
  if(filters.range === "future"){
    query.datetime = { $gt: endOfDay };
  }
  if(filters.date && filters.date !== "today"){
    const d = new Date(filters.date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    query.datetime = { $gte: start, $lte: end };
  }
  if (filters.search) {
    query.task = { $regex: filters.search, $options: "i" };
  }
  if(filters.status){
    if(filters.status==="done"){
      query.reminded=true;
    }
    else if(filters.status==="pending"){
      query.reminded=false;
    }
  }
 return Reminder.find(query).sort({ datetime: 1 });
}