import Schedule from "../models/schedule.model.js";

export async function createSchedule(data) {
  return Schedule.create(data);
}

export async function getSchedulesWithFilters(userId, filters) {
  const query = { createdBy: userId };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  if (filters.date === "today" || filters.range === "today") {
    query.start = { $gte: startOfDay, $lte: endOfDay };
  }

  if (filters.range === "past") {
    query.start = { $lt: startOfDay };
  }

  if (filters.range === "future") {
    query.start = { $gt: endOfDay };
  }

  if (filters.date && filters.date !== "today") {
    const d = new Date(filters.date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    query.start = { $gte: start, $lte: end };
  }

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.label) query.labels = filters.label;
  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  return Schedule.find(query).sort({ start: 1 });
}

export async function markdoneSchedule(scheduleId) {
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) throw new Error("Schedule not found");
  schedule.status = "completed";
  return schedule.save();
}