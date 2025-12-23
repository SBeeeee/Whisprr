import Task from "../models/tasks.model.js"
import User from "../models/Users.models.js"

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

    // Get current time in IST (India Standard Time)
    const now = new Date();
    
    // Convert to IST - India is UTC+5:30
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istNow = new Date(now.getTime() + istOffset);
    
    // Create day boundaries in IST
    const startOfDay = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate(), 23, 59, 59, 999);
    
    // Convert back to UTC for database comparison (MongoDB stores in UTC)
    const startOfDayUTC = new Date(startOfDay.getTime() - istOffset);
    const endOfDayUTC = new Date(endOfDay.getTime() - istOffset);

    console.log("🇮🇳 IST Date:", istNow.toDateString());
    console.log("🌅 Start of day (UTC for DB):", startOfDayUTC.toISOString());
    console.log("🌆 End of day (UTC for DB):", endOfDayUTC.toISOString());

    if (filters.date === "today" || filters.range === "today") {
        query.dueDate = { $gte: startOfDayUTC, $lte: endOfDayUTC };
    }

    if (filters.range === "past") {
        query.dueDate = { $lt: startOfDayUTC };
    }

    if (filters.range === "future") {
        query.dueDate = { $gt: endOfDayUTC };
    }

    if(filters.date && filters.date !== "today"){
        const d = new Date(filters.date);
        
        // Create IST boundaries for the specific date
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        
        // Convert to UTC for database query
        const startUTC = new Date(start.getTime() - istOffset);
        const endUTC = new Date(end.getTime() - istOffset);
        
        query.dueDate = { $gte: startUTC, $lte: endUTC };
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

export async function getAnalysisTask(userId){
    const totalTasks = await Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
    });

    const completedTasks = await Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: "completed",
    });

    const pendingTasks = totalTasks - completedTasks;

    return {
        totalTasks,
        completedTasks,
        pendingTasks,
    };
}

export async function ShiftToTommorow(taskId){
    const task = await Task.findById(taskId);
    if (!task){
        throw new Error("Task not found");
    }

    // Get current due date
    const currentDueDate = task.dueDate;

    // Add one day (24 hours) to the current due date
    const newDueDate = new Date(currentDueDate.getTime() + 24 * 60 * 60 * 1000);

    // Update the task's due date
    task.dueDate = newDueDate;
    await task.save();
    return task;
}