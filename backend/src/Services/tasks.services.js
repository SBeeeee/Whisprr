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

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);


    if (filters.date === "today" || filters.range === "today") {
        query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (filters.range === "past") {
        query.dueDate = { $lt: startOfDay };
    }

    if (filters.range === "future") {
        query.dueDate = { $gt: endOfDay };
    }

    if(filters.date && filters.date !=="today"){
        const d = new Date(filters.date);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        query.dueDate = { $gte: start, $lte: end };
    }

    if(filters.status) query.status=filters.status;
    if(filters.priority) query.priority=filters.priority;
    if(filters.label) query.labels=filters.label;

    if(filters.search){
        query.title={$regex:filters.search,$options:"i"};
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