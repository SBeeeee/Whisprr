import express from "express";
import { createReminders } from "../controllers/reminder.controller.js";
import scheduleReminders from "../utils/scheduler.js";

const router = express.Router();

router.post("/", createReminders);
router.get('/',scheduleReminders)

export default router;