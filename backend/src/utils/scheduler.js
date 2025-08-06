import twilio from "twilio";
import dotenv from "dotenv";
import {
  getRemindersToTrigger,
  markAsReminded,
} from "../Services/reminder.services.js";

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// ✅ This is now a normal async function you can call directly
export default async function scheduleReminders() {
  try {
    const reminders = await getRemindersToTrigger();

    for (const reminder of reminders) {
      const message = `Reminder: ${reminder.task} in the coming 10 minutes. Don't miss it!`;

      try {
        await client.messages.create({
          body: message,
          from: "whatsapp:" + process.env.TWILIO_WHATSAPP,
          to: "whatsapp:" + reminder.phoneNumber,
        });

        await markAsReminded(reminder._id);
      } catch (err) {
        console.error("Failed to send reminder:", err.message);
      }
    }

    console.log(`[${new Date().toISOString()}] Reminders processed`);
  } catch (err) {
    console.error("Error running reminder job:", err.message);
  }
}
