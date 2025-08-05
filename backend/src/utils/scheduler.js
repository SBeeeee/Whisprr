import cron from "node-cron";
import twilio from "twilio";
import dotenv from "dotenv";
import { getRemindersToTrigger,markAsReminded } from "../Services/reminder.services.js";

dotenv.config();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export default function scheduleReminders() {
  cron.schedule("* * * * *", async () => {
    const reminders = await getRemindersToTrigger();

    reminders.forEach(async (reminder) => {
      const message = `Reminder: ${reminder.task} in the coming 10 minutes dont miss it.}`;

      try {
        // WhatsApp message
        await client.messages.create({
          body: message,
          from: "whatsapp:" + process.env.TWILIO_WHATSAPP,
          to: "whatsapp:" + reminder.phoneNumber,
        });

        // Optional call (commented)
        // await client.calls.create({
        //   twiml: `<Response><Say>${message}</Say></Response>`,
        //   to: reminder.phoneNumber,
        //   from: process.env.TWILIO_PHONE,
        // });

        await markAsReminded(reminder._id);
      } catch (err) {
        console.error("Failed to send reminder:", err.message);
      }
    });
  });
}
