// ============================================
// VOICE ACTION SERVICE - Complete Implementation
// ============================================

import { 
  createTask, 
  MarkasDone, 
  ShiftToTommorow,
  getTasksWithFilters,
  getAnalysisTask} from '../Services/tasks.services.js'

import { 
  createSchedule, 
  getSchedulesWithFilters,
  markdoneSchedule 
} from '../Services/schedule.services.js'

import { 
  CreateTeam, 
  Addmember, 
  GetAllTeamsForUser 
} from '../Services/team.services.js';

import { 
  UpdateScratchpad, 
  getScratchPadcontent 
} from "../Services/scratchpad.services.js";

import { resolveTaskFromVoice} from "./voice TaskResolver.services.js";
import Task from "../models/tasks.model.js";
import Schedule from "../models/schedule.model.js";

/**
 * Main voice action executor
 */
export async function executeVoiceAction({
  intent,
  keywords,
  entities,
  userId,
}) {
  try {
    switch (intent) {
      // ==================== TASK OPERATIONS ====================
      
      case "CREATE_TASK":
        return await handleCreateTask(entities, userId);
      
      case "MARK_DONE":
        return await handleMarkDone(keywords, userId);
      
      case "SHIFT_TOMORROW":
        return await handleShiftTomorrow(keywords, userId);
      
      case "GET_TASKS":
        return await handleGetTasks(entities, userId);
      
      // ==================== SCHEDULE OPERATIONS ====================
      
      case "CREATE_SCHEDULE":
        return await handleCreateSchedule(entities, userId);
      
      case "MARK_SCHEDULE_DONE":
        return await handleMarkScheduleDone(keywords, userId);
      
      case "GET_SCHEDULES":
        return await handleGetSchedules(entities, userId);
      
      // ==================== TEAM OPERATIONS ====================
      
      case "CREATE_TEAM":
        return await handleCreateTeam(entities, userId);
      
      case "ADD_TEAM_MEMBER":
        return await handleAddTeamMember(entities, userId);
      
      case "GET_TEAMS":
        return await handleGetTeams(userId);
      
      // ==================== SCRATCHPAD OPERATIONS ====================
      
      case "UPDATE_SCRATCHPAD":
        return await handleUpdateScratchpad(entities, userId);
      
      // ==================== QUERY OPERATIONS ====================
      
      case "GET_ANALYSIS":
        return await handleGetAnalysis(userId);
      
      default:
        throw new Error(`Unsupported intent: ${intent}`);
    }
  } catch (error) {
    console.error("[Voice Action Error]", error);
    throw error;
  }
}

/**
 * Handle confirmed actions for ambiguous commands
 */
export async function executeConfirmedAction(itemId, action, userId) {
  try {
    switch (action) {
      case "MARK_DONE": {
        // Verify task belongs to user
        const task = await Task.findOne({
          _id: itemId,
          $or: [{ createdBy: userId }, { assignedTo: userId }],
        });
        
        if (!task) {
          throw new Error("Task not found or unauthorized");
        }
        
        const updated = await MarkasDone(itemId);
        return {
          success: true,
          message: `Task "${task.title}" marked as completed!`,
          data: updated,
        };
      }
      
      case "SHIFT_TOMORROW": {
        // Verify task belongs to user
        const task = await Task.findOne({
          _id: itemId,
          $or: [{ createdBy: userId }, { assignedTo: userId }],
        });
        
        if (!task) {
          throw new Error("Task not found or unauthorized");
        }
        
        const updated = await ShiftToTommorow(itemId);
        const newDate = new Date(updated.dueDate).toLocaleDateString();
        
        return {
          success: true,
          message: `Task "${task.title}" shifted to ${newDate}`,
          data: updated,
        };
      }
      
      case "MARK_SCHEDULE_DONE": {
        // Verify schedule belongs to user
        const schedule = await Schedule.findOne({
          _id: itemId,
          createdBy: userId,
        });
        
        if (!schedule) {
          throw new Error("Schedule not found or unauthorized");
        }
        
        const updated = await markdoneSchedule(itemId);
        
        return {
          success: true,
          message: `Schedule "${schedule.title}" marked as completed!`,
          data: updated,
        };
      }
      
      default:
        throw new Error(`Unknown confirmation action: ${action}`);
    }
  } catch (error) {
    console.error("[Confirmation Error]", error);
    throw error;
  }
}

// ============================================
// TASK HANDLERS
// ============================================

async function handleCreateTask(entities, userId) {
  const { title, dueDate, priority = "medium", status = "pending", label } = entities;
  
  if (!title) {
    throw new Error("Task title is required");
  }
  
  const taskData = {
    createdBy: userId,
    title,
    status,
    priority,
    source: "voice",
  };
  
  if (dueDate) {
    taskData.dueDate = new Date(dueDate);
  }
  
  if (label) {
    taskData.labels = [label];
  }
  
  const task = await createTask(taskData);
  
  return {
    success: true,
    action: "CREATE_TASK",
    message: `Task "${title}" created successfully${dueDate ? ` for ${new Date(dueDate).toLocaleDateString()}` : ""}`,
    data: task,
  };
}

async function handleMarkDone(keywords, userId) {
  const tasks = await resolveTaskFromVoice({ userId, keywords });
  
  if (!tasks.length) {
    return {
      success: false,
      action: "MARK_DONE",
      message: "No matching pending task found. Try being more specific.",
    };
  }
  
  if (tasks.length > 1) {
    return {
      success: false,
      action: "MARK_DONE",
      needsConfirmation: true,
      message: "Multiple tasks found. Which one would you like to mark as done?",
      tasks: tasks.map(t => ({
        id: t._id,
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
      })),
    };
  }
  
  const task = tasks[0];
  const updatedTask = await MarkasDone(task._id);
  
  return {
    success: true,
    action: "MARK_DONE",
    message: `Task "${task.title}" marked as completed! 🎉`,
    data: updatedTask,
  };
}

async function handleShiftTomorrow(keywords, userId) {
  const tasks = await resolveTaskFromVoice({ userId, keywords });
  
  if (!tasks.length) {
    return {
      success: false,
      action: "SHIFT_TOMORROW",
      message: "No matching task found.",
    };
  }
  
  if (tasks.length > 1) {
    return {
      success: false,
      action: "SHIFT_TOMORROW",
      needsConfirmation: true,
      message: "Multiple tasks found. Which one would you like to shift?",
      tasks: tasks.map(t => ({
        id: t._id,
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
      })),
    };
  }
  
  const task = tasks[0];
  const updatedTask = await ShiftToTommorow(task._id);
  
  const newDate = new Date(updatedTask.dueDate).toLocaleDateString();
  
  return {
    success: true,
    action: "SHIFT_TOMORROW",
    message: `Task "${task.title}" shifted to ${newDate}`,
    data: updatedTask,
  };
}

async function handleGetTasks(entities, userId) {
  const filters = {};
  
  if (entities.status) filters.status = entities.status;
  if (entities.priority) filters.priority = entities.priority;
  if (entities.label) filters.label = entities.label;
  
  // Handle date filtering
  if (entities.dueDate) {
    const dateStr = new Date(entities.dueDate).toISOString().split("T")[0];
    filters.date = dateStr;
  }
  
  const tasks = await getTasksWithFilters(userId, filters);
  
  return {
    success: true,
    action: "GET_TASKS",
    message: `Found ${tasks.length} task(s)`,
    data: tasks,
  };
}

// ============================================
// SCHEDULE HANDLERS
// ============================================

async function handleCreateSchedule(entities, userId) {
  const { 
    title, 
    dueDate, 
    startTime, 
    endTime, 
    duration,
    priority = "medium",
    label 
  } = entities;
  
  if (!title) {
    throw new Error("Schedule title is required");
  }
  
  // Calculate start and end times
  let start = dueDate ? new Date(dueDate) : new Date();
  let end = new Date(start);
  
  if (startTime) {
    const [hours, minutes] = startTime.split(":").map(Number);
    start.setHours(hours, minutes, 0, 0);
    end = new Date(start);
  }
  
  if (endTime) {
    const [hours, minutes] = endTime.split(":").map(Number);
    end.setHours(hours, minutes, 0, 0);
  } else if (duration) {
    end = new Date(start.getTime() + duration * 60000);
  } else {
    // Default 1 hour
    end = new Date(start.getTime() + 60 * 60000);
  }
  
  const scheduleData = {
    createdBy: userId,
    title,
    start,
    end,
    priority,
    status: "pending",
  };
  
  if (label) {
    scheduleData.labels = [label];
  }
  
  const schedule = await createSchedule(scheduleData);
  
  return {
    success: true,
    action: "CREATE_SCHEDULE",
    message: `Schedule "${title}" created for ${start.toLocaleString()}`,
    data: schedule,
  };
}

async function handleMarkScheduleDone(keywords, userId) {
  const schedules = await getSchedulesWithFilters(userId, { 
    status: "pending",
    range: "today" 
  });
  
  if (!schedules.length) {
    return {
      success: false,
      action: "MARK_SCHEDULE_DONE",
      message: "No pending schedules found for today.",
    };
  }
  
  const matched = schedules.filter(s => 
    s.title.toLowerCase().includes(keywords.toLowerCase())
  );
  
  if (matched.length === 0) {
    if (schedules.length === 1) {
      const schedule = schedules[0];
      const updated = await markdoneSchedule(schedule._id);
      
      return {
        success: true,
        action: "MARK_SCHEDULE_DONE",
        message: `Schedule "${schedule.title}" marked as completed!`,
        data: updated,
      };
    }
    
    return {
      success: false,
      action: "MARK_SCHEDULE_DONE",
      needsConfirmation: true,
      message: "Multiple schedules found. Which one?",
      schedules: schedules.map(s => ({ 
        id: s._id, 
        title: s.title, 
        start: s.start,
        end: s.end,
      })),
    };
  }
  
  if (matched.length > 1) {
    return {
      success: false,
      action: "MARK_SCHEDULE_DONE",
      needsConfirmation: true,
      message: "Multiple matching schedules found.",
      schedules: matched.map(s => ({ 
        id: s._id, 
        title: s.title, 
        start: s.start,
        end: s.end,
      })),
    };
  }
  
  const updated = await markdoneSchedule(matched[0]._id);
  
  return {
    success: true,
    action: "MARK_SCHEDULE_DONE",
    message: `Schedule "${matched[0].title}" marked as completed!`,
    data: updated,
  };
}

async function handleGetSchedules(entities, userId) {
  const filters = {};
  
  if (entities.status) filters.status = entities.status;
  if (entities.priority) filters.priority = entities.priority;
  if (entities.label) filters.label = entities.label;
  
  if (entities.dueDate) {
    const dateStr = new Date(entities.dueDate).toISOString().split("T")[0];
    filters.date = dateStr;
  }
  
  const schedules = await getSchedulesWithFilters(userId, filters);
  
  return {
    success: true,
    action: "GET_SCHEDULES",
    message: `Found ${schedules.length} schedule(s)`,
    data: schedules,
  };
}

// ============================================
// TEAM HANDLERS
// ============================================

async function handleCreateTeam(entities, userId) {
  const teamName = entities.teamName || entities.title;
  
  if (!teamName) {
    throw new Error("Team name is required");
  }
  
  const teamData = {
    name: teamName,
    createdBy: userId,
    members: [],
  };
  
  const team = await CreateTeam(teamData);
  
  return {
    success: true,
    action: "CREATE_TEAM",
    message: `Team "${teamName}" created successfully!`,
    data: team,
  };
}

async function handleAddTeamMember(entities, userId) {
  const { memberPhone, role = "member", teamName } = entities;
  
  if (!memberPhone) {
    throw new Error("Member phone number is required");
  }
  
  let teamId;
  
  if (teamName) {
    const teams = await GetAllTeamsForUser(userId);
    const matchedTeam = teams.find(t => 
      t.name.toLowerCase().includes(teamName.toLowerCase())
    );
    
    if (!matchedTeam) {
      return {
        success: false,
        action: "ADD_TEAM_MEMBER",
        message: `Team "${teamName}" not found`,
      };
    }
    
    teamId = matchedTeam._id;
  } else {
    const teams = await GetAllTeamsForUser(userId);
    
    if (!teams.length) {
      return {
        success: false,
        action: "ADD_TEAM_MEMBER",
        message: "No teams found. Create a team first.",
      };
    }
    
    teamId = teams[0]._id;
  }
  
  const team = await Addmember(teamId, memberPhone, role);
  
  return {
    success: true,
    action: "ADD_TEAM_MEMBER",
    message: `Member added to team as ${role}`,
    data: team,
  };
}

async function handleGetTeams(userId) {
  const teams = await GetAllTeamsForUser(userId);
  
  return {
    success: true,
    action: "GET_TEAMS",
    message: `Found ${teams.length} team(s)`,
    data: teams,
  };
}

// ============================================
// SCRATCHPAD HANDLER
// ============================================

async function handleUpdateScratchpad(entities, userId) {
  const { content } = entities;
  
  if (!content) {
    throw new Error("Content is required");
  }
  
  const existing = await getScratchPadcontent(userId);
  
  if (!existing.id) {
    throw new Error("No scratchpad found. Create one first.");
  }
  
  const result = await UpdateScratchpad(existing.id, content, userId);
  
  return {
    success: true,
    action: "UPDATE_SCRATCHPAD",
    message: "Scratchpad updated successfully",
    data: result,
  };
}

// ============================================
// ANALYSIS HANDLER
// ============================================

async function handleGetAnalysis(userId) {
  const analysis = await getAnalysisTask(userId);
  
  return {
    success: true,
    action: "GET_ANALYSIS",
    message: "Analysis retrieved",
    data: analysis,
  };
}