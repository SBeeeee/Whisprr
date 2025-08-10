import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import reminderroutes from "./src/routes/reminder.routes.js";
import scheduleReminders from "./src/utils/scheduler.js";
import userRoutes from "./src/routes/user.routes.js";
import taskRouter from "./src/routes/task.controller.js";
import { connectDB } from "./src/lib/database.js";

dotenv.config()

const app=express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/reminders",reminderroutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRouter);

app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:" + process.env.PORT);
    connectDB();
    scheduleReminders();
  });
  