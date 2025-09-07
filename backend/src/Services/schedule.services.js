import Schedule from "../models/schedule.model.js";

export async function createSchedule(data) {
  return Schedule.create(data);
}

export async function getSchedulesWithFilters(userId, filters) {
  const query = { createdBy: userId };

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
  console.log("🌅 Schedule Start of day (UTC for DB):", startOfDayUTC.toISOString());
  console.log("🌆 Schedule End of day (UTC for DB):", endOfDayUTC.toISOString());

  if (filters.date === "today" || filters.range === "today") {
    query.start = { $gte: startOfDayUTC, $lte: endOfDayUTC };
  }

  if (filters.range === "past") {
    query.start = { $lt: startOfDayUTC };
  }

  if (filters.range === "future") {
    query.start = { $gt: endOfDayUTC };
  }

  if (filters.date && filters.date !== "today") {
    const d = new Date(filters.date);
    
    // Create IST boundaries for the specific date
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    
    // Convert to UTC for database query
    const startUTC = new Date(start.getTime() - istOffset);
    const endUTC = new Date(end.getTime() - istOffset);
    
    query.start = { $gte: startUTC, $lte: endUTC };
  }

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.label) query.labels = filters.label;
  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  console.log("📋 Schedule Query:", JSON.stringify(query, null, 2));

  return Schedule.find(query).sort({ start: 1 });
}

export async function markdoneSchedule(scheduleId) {
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) throw new Error("Schedule not found");
  schedule.status = "completed";
  return schedule.save();
}