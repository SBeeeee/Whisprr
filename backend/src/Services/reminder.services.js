import Reminder from "../models/reminders.model.js";

export const createReminder =async({ task, datetime, phoneNumber }) =>{
    const reminder = new Reminder({ task, datetime, phoneNumber });
    await reminder.save();
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