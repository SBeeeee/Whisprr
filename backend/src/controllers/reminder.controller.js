import { createReminder,getRemindersToTrigger,markAsReminded } from "../Services/reminder.services.js";

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

