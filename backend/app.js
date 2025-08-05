import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import reminderroutes from "./src/routes/reminder.routes.js";
import scheduleReminders from "./src/utils/scheduler.js";
import { connectDB } from "./src/lib/database.js";

dotenv.config()

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/reminders",reminderroutes);
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:" + process.env.PORT);
    connectDB();
    scheduleReminders();
  });
  
