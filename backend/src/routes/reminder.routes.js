import express from "express";
import { createReminders } from "../controllers/reminder.controller.js";

const router = express.Router();

router.post("/", createReminders);

export default router;