import { createReminder,getRemindersToTrigger,markAsReminded } from "../Services/reminder.services.js";

export const createReminders = async (req, res) => {
    try {
      const reminder = await createReminder(req.body);
      res.status(201).json(reminder);
    } catch (error) {
      res.status(500).json({ error: "Failed to create reminder" });
    }
  };