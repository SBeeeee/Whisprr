import { MarkasDone,createTask,ShiftToTommorow } from "./tasks.services.js";
import { resolveTaskFromVoice } from "./voice TaskResolver.services.js";




export async function executeVoiceAction({
    intent,
    keywords,
    entities,
    userId,
  }) {
    // 🔹 1. CREATE TASK
    if (intent === "CREATE_TASK") {
      const {
        title,
        dueDate,
        priority = "medium",
      } = entities;
  
      if (!title) {
        throw new Error("Task title missing");
      }
  
      return await createTask({
        createdBy:userId,
        title,
        dueDate,
        priority,
        source: "voice",
      });
    }
  
    // 🔹 2. TASK MODIFICATION
    if (intent === "MARK_DONE" || intent === "SHIFT_TOMORROW") {
      const tasks = await resolveTaskFromVoice({
        userId,
        keywords,
      });
  
      if (!tasks.length) {
        throw new Error("No matching task found");
      }
  
      if (tasks.length > 1) {
        return {
          needsConfirmation: true,
          tasks,
        };
      }
  
      const task = tasks[0];
  
      if (intent === "MARK_DONE") {
        return await MarkasDone(task._id);
      }
  
      if (intent === "SHIFT_TOMORROW") {
        return await ShiftToTommorow(task._id);
      }
    }
  
    throw new Error("Unsupported action");
  }
  