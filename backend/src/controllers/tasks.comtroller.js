import {
    createTask, 
    getTaskById,
    getTasksWithFilters, // Updated function name
    updateTask,
    deleteTask,
} from "../Services/tasks.services.js";

// Create
export async function createTaskController(req, res) {
    try {
        const taskData = { ...req.body, createdBy: req.id };
        const task = await createTask(taskData);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Read single
export async function getTaskController(req, res) {
    try {
        const task = await getTaskById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Read all for user with filters - Enhanced version
export async function getUserTasksController(req, res) {
    try {
        const { date, range, search, label, status, priority, assigned } = req.query;
        const tasks = await getTasksWithFilters(req.id, {
            date,
            range,
            search,
            label,
            status,
            priority,
            assigned,
        });
        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update
export async function updateTaskController(req, res) {
    try {
        const task = await updateTask(req.params.id, req.body);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete
export async function deleteTaskController(req, res) {
    try {
        const task = await deleteTask(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task deleted successfully" });
        res.json({ success: true, message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}