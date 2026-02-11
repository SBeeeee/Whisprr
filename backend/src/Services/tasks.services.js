import Task from "../models/tasks.model.js"
import User from "../models/Users.models.js"
import Schedule from "../models/schedule.model.js";
import mongoose from "mongoose";
import timezoneService from "../utils/timezoneService.js";

export async function createTask(data) {
    const task = await Task.create(data);
  
    // Add task to creator's tasks list
    await User.findByIdAndUpdate(task.createdBy, {
      $push: { tasks: task._id },
    });
  
    return task;
}
  
export async function getTaskById(taskId) {
    return Task.findById(taskId)
      .populate("createdBy", "username phone")
      .populate("assignedTo", "username phone");
}

export async function getTasksWithFilters(userId, filters) {
    const query = {
        $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    // Get current date range in IST using centralized service
    const todayRange = timezoneService.getDayRangeUTC();
    
    console.log("🇮🇳 IST Date:", timezoneService.now().format('YYYY-MM-DD'));
    console.log("🌅 Start of day (UTC for DB):", todayRange.startISOString);
    console.log("🌆 End of day (UTC for DB):", todayRange.endISOString);

    if (filters.date === "today" || filters.range === "today") {
        query.dueDate = { $gte: todayRange.start, $lte: todayRange.end };
    }

    if (filters.range === "past") {
        query.dueDate = { $lt: todayRange.start };
    }

    if (filters.range === "future") {
        query.dueDate = { $gt: todayRange.end };
    }

    if(filters.date && filters.date !== "today"){
        const specificDateRange = timezoneService.getDayRangeUTC(new Date(filters.date));
        query.dueDate = { $gte: specificDateRange.start, $lte: specificDateRange.end };
    }

    if(filters.status) query.status = filters.status;
    if(filters.priority) query.priority = filters.priority;
    if(filters.label) query.labels = filters.label;

    if(filters.search){
        query.title = {$regex: filters.search, $options: "i"};
    }

    return Task.find(query)
        .populate("createdBy", "username phone")
        .populate("assignedTo", "username phone")
        .sort({ dueDate: 1, priority: -1 }); // Sort by due date, then priority (high to low)
}

export async function getTasksForUser(userId) {
    return Task.find({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
    })
    .populate("createdBy", "username phone")
    .populate("assignedTo", "username phone")
    .sort({ dueDate: 1 });
}
  
export async function updateTask(taskId, updates) {
    return Task.findByIdAndUpdate(taskId, updates, { new: true })
        .populate("createdBy", "username phone")
        .populate("assignedTo", "username phone");
}
  
export async function deleteTask(taskId) {
    const task = await Task.findByIdAndDelete(taskId);
  
    if (task) {
        // Remove from creator's task list
        await User.findByIdAndUpdate(task.createdBy, {
            $pull: { tasks: task._id },
        });
    }
    return task;
}

export async function MarkasDone(taskId) {
    const task = await Task.findById(taskId);
    if (!task){
        throw new Error("Task not found");
    }
    task.status = "completed";
    await task.save();
    return task;
}

export async function getAnalysisTask(userId) {
  
  // Get today's date range in IST using centralized service
  const todayRange = timezoneService.getDayRangeUTC();

  /* =========================
     1. PENDING EVENTS (ALL)
     ========================= */

  const pendingTasks = await Task.countDocuments({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status:"pending",
  });

  const pendingSchedules = await Schedule.countDocuments({
    createdBy: userId,
    status: "pending",
  });

  const pendingEvents = pendingTasks + pendingSchedules;

  /* =========================
     2. PENDING EVENTS TODAY
     ========================= */

  const pendingTasksToday = await Task.countDocuments({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status:"pending",
    dueDate: { $gte: todayRange.start, $lte: todayRange.end },
  });

  const pendingSchedulesToday = await Schedule.countDocuments({
    createdBy: userId,
    status: "pending",
    start: { $gte: todayRange.start, $lte: todayRange.end },
  });

  const pendingEventsToday =
    pendingTasksToday + pendingSchedulesToday;

  /* =========================
     3. TODAY'S DONE EVENTS
     ========================= */

  const tasksDoneToday = await Task.countDocuments({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status: "completed",
    updatedAt: { $gte: todayRange.start, $lte: todayRange.end },
  });

  const schedulesDoneToday = await Schedule.countDocuments({
    createdBy: userId,
    status: "completed",
    updatedAt: { $gte: todayRange.start, $lte: todayRange.end },
  });

  const todaysDoneEvents =
    tasksDoneToday + schedulesDoneToday;

  /* =========================
     4. OVERDUE EVENTS 🔥
     ========================= */

  const overdueTasks = await Task.countDocuments({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status:"pending",
    dueDate: { $lt: todayRange.start },
  });

  const overdueSchedules = await Schedule.countDocuments({
    createdBy: userId,
    status: "pending",
    start: { $lt: todayRange.start },
  });

  const overdueEvents =
    overdueTasks + overdueSchedules;

  /* ========================= */

  return {
    pendingEvents,
    pendingEventsToday,
    todaysDoneEvents,
    overdueEvents,
  };
}


export async function ShiftToTommorow(taskId){
    const task = await Task.findById(taskId);
    if (!task){
        throw new Error("Task not found");
    }

    // Get current due date
    const currentDueDate = task.dueDate;

    // Add one day using centralized timezone service
    const newDueDate = timezoneService.addDays(currentDueDate, 1);

    // Update the task's due date
    task.dueDate = newDueDate;
    await task.save();
    return task;
}