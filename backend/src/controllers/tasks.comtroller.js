import {
    createTask, 
    getTaskById,
    getTasksWithFilters, // Updated function name
    updateTask,
    deleteTask,
    MarkasDone,
    getAnalysisTask,
    ShiftToTommorow
} from "../Services/tasks.services.js";
import Team from "../models/Team.models.js";
// Create
export async function createTaskController(req, res) {
    try {
        const taskData = { ...req.body, createdBy: req.id };
        
        // ✅ If it's a TEAM TASK, check permissions
        if (taskData.team) {
            // Get team and find member role
            const team = await Team.findById(taskData.team);
            
            if (!team) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Team not found" 
                });
            }
            
            const member = team.members.find(m => {
                const userId = (m.user._id || m.user).toString();
                return userId === req.id.toString();
            });
            
            if (!member) {
                return res.status(403).json({ 
                    success: false, 
                    message: "You are not a member of this team" 
                });
            }
            
            // ✅ ROLE-BASED AUTHORIZATION
            if (member.role === "member") {
                // Members can only assign tasks to themselves
                if (taskData.assignedTo && taskData.assignedTo.length > 0) {
                    const assignedToSelf = taskData.assignedTo.every(id => 
                        id.toString() === req.id.toString()
                    );
                    
                    if (!assignedToSelf) {
                        return res.status(403).json({ 
                            success: false, 
                            message: "Members can only create tasks assigned to themselves. Only admins can assign tasks to other members." 
                        });
                    }
                }
                
                // If no assignedTo specified, set it to creator (self)
                if (!taskData.assignedTo || taskData.assignedTo.length === 0) {
                    taskData.assignedTo = [req.id];
                }
            }
            // Admin can assign to anyone (no restriction)
        }
        
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
        if (req.task?.team && req.teamRole !== "admin") {
            delete req.body.title;
            delete req.body.priority;
            delete req.body.dueDate;
            delete req.body.assignedTo;
          }
          
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

export async function MarkasDoneController(req,res){
    try{
        const task = await MarkasDone(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        res.json({ success: true, data: task });
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getAnalysisTaskController(req,res){
    try{
        const analysis = await getAnalysisTask(req.id);
        res.json({ success: true, data: analysis });
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function ShiftToTommorowController(req,res){
    try{
        const task = await ShiftToTommorow(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        res.json({ success: true, data: task });
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}