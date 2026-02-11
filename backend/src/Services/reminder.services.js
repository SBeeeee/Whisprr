import Reminder from "../models/reminders.model.js";
import User from "../models/Users.models.js"
import timezoneService from "../utils/timezoneService.js";

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
    const now = timezoneService.now();
    const target = now.add(10, 'minutes').utc().toDate();
  
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
  const todayRange = timezoneService.getDayRangeUTC();

  if(filters.date === "today" || filters.range === "today"){
    query.datetime = { $gte: todayRange.start, $lte: todayRange.end };
  }
  if(filters.range === "past"){
    query.datetime = { $lt: todayRange.start };
  }
  if(filters.range === "future"){
    query.datetime = { $gt: todayRange.end };
  }
  if(filters.date && filters.date !== "today"){
    const specificDateRange = timezoneService.getDayRangeUTC(new Date(filters.date));
    query.datetime = { $gte: specificDateRange.start, $lte: specificDateRange.end };
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