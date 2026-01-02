import express from "express";
import { createReminders,getReminders} from "../controllers/reminder.controller.js";
import scheduleReminders from "../utils/scheduler.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",verifyUser, createReminders);
router.get("/1", async (req, res) => {
    try {
      await scheduleReminders(); // Trigger the reminder logic
      res.status(200).send("Reminders checked and sent (if any)");
    } catch (error) {
      console.error("Error in scheduled reminders:", error);
      res.status(500).send("Error while checking reminders");
    }
  });
router.get("/reminders",verifyUser,getReminders) ;

export default router;