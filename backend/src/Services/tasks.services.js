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
  
  // Get single task by ID
  export async function getTaskById(taskId) {
    return Task.findById(taskId)
      .populate("createdBy", "username phone")
      .populate("assignedTo", "username phone");
  }
  
  // Get all tasks for a user
  export async function getTasksForUser(userId) {
    return Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).sort({ dueDate: 1 });
  }
  
  // Update a task
  export async function updateTask(taskId, updates) {
    return Task.findByIdAndUpdate(taskId, updates, { new: true });
  }
  
  // Delete a task
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