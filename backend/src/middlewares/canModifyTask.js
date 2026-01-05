import Task from "../models/tasks.model";
import Team from "../models/Team.models";
export const canModifyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
  
    // PERSONAL TASK
    if (!task.team) {
      if (!task.createdBy.equals(req.id)) {
        return res.status(403).json({ message: "Not allowed" });
      }
      req.task = task;
      return next();
    }
  
    // TEAM TASK
    const team = await Team.findById(task.team);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    const member = team.members.find(m => m.user.equals(req.id));
  
    if (!member) {
      return res.status(403).json({ message: "Not a team member" });
    }
  
    // ADMIN → full access
    if (member.role === "admin") {
      req.task = task;
      req.teamRole = "admin";
      return next();
    }
  
    // MEMBER → only assigned tasks
    const isAssigned = task.assignedTo.some(u => u.equals(req.id));
    
    if (!isAssigned) {
      return res.status(403).json({ message: "Not assigned to task" });
    }
  
    req.task = task;
    req.teamRole = member.role;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};