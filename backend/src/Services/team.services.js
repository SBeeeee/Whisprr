import Team from "../models/Team.models.js";
import Task from "../models/tasks.model.js";

export const CreateTeam=async(data)=>{ 
  const team=await Team.create(data);
  return team;
}

export const Addmember = async (teamId, memberId, role) => {
    const team = await Team.findByIdAndUpdate(
      teamId,
      {
        $addToSet: {
          members: {
            user: memberId,
            role: role
          }
        }
      },
      { new: true }
    ).populate("members.user", "username phone")
    .populate("createdBy", "username phone");
  
    return team;
  };

export const GetTeamById=async(id)=>{
  const team =await Team.findById(id).populate({path:"members.user",select:"username phone"})
  .populate({path:"createdBy",select:"username phone"});

  return team;
}

export const GetAllTeamsForUser=async(userId)=>{
  const teams =await Team.find({
    $or:[{"createdBy":userId},{"members.user":userId}]
  })
  .populate("createdBy", "username")
  .populate("members.user", "username");

  return teams;
}


export const getTeamsDashboard = async (userId, filters = {}) => {
  /* ================= TEAM CARDS ================= */

  const teams = await Team.find({
    $or: [
      { createdBy: userId },
      { "members.user": userId }
    ]
  })
    .select("name members createdBy")
    .lean();

  const teamIds = teams.map(t => t._id);

  const teamStats = await Task.aggregate([
    { $match: { team: { $in: teamIds } } },
    {
      $group: {
        _id: "$team",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
        }
      }
    }
  ]);

  const teamStatsMap = {};
  teamStats.forEach(stat => {
    teamStatsMap[stat._id.toString()] = stat;
  });

  const teamsWithStats = teams.map(team => ({
    ...team,
    stats: teamStatsMap[team._id.toString()] || {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0
    }
  }));

  /* ================= MY TASKS ================= */

  const {
    status,
    priority,
    team,
    filter,
    q
  } = filters;

  const taskQuery = {
    assignedTo: { $in: [userId] },
    team: { $ne: null }
  };

  if (status) taskQuery.status = status;
  if (priority) taskQuery.priority = priority;
  if (team) taskQuery.team = team;
  if (q) taskQuery.title = { $regex: q, $options: "i" };

  const now = new Date();

  if (filter === "overdue") {
    taskQuery.dueDate = { $lt: now };
    taskQuery.status = { $ne: "completed" };
  }

  if (filter === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    taskQuery.dueDate = { $gte: start, $lte: end };
  }

  if (filter === "upcoming") {
    const future = new Date();
    future.setDate(future.getDate() + 7);

    taskQuery.dueDate = { $gte: now, $lte: future };
  }

  const myTasks = await Task.find(taskQuery)
    .select("title status priority dueDate team")
    .populate("team", "name")
    .sort({ dueDate: 1 })
    .lean();

  /* ================= FINAL RESPONSE ================= */

  return {
    teams: teamsWithStats,
    myTasks
  };
};

export const GetTeamTasks=async(teamId,filters={})=>{
  const {
    status,
    priority,
    assignedTo,
    q
  } = filters;

  const taskQuery = {
    team: teamId
  };

  if (status) taskQuery.status = status;
  if (priority) taskQuery.priority = priority;
  if (assignedTo) taskQuery.assignedTo = assignedTo;
  if (q) taskQuery.title = { $regex: q, $options: "i" };

  const tasks = await Task.find(taskQuery)
    .populate("assignedTo", "username")
    .populate("createdBy", "username")
    .sort({ dueDate: 1 })
    .lean();

  return tasks;
}