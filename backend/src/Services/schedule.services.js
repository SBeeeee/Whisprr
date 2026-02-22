import Schedule from "../models/schedule.model.js";
import timezoneService from "../utils/timezoneService.js";

export async function createSchedule(data) {
  return Schedule.create(data);
}

export async function getSchedulesWithFilters(userId, filters) {
  const query = { createdBy: userId };

  // Get current date range in IST using centralized service
  const todayRange = timezoneService.getDayRangeUTC();
  
  console.log("🇮🇳 IST Date:", timezoneService.now().format('YYYY-MM-DD'));
  console.log("🌅 Schedule Start of day (UTC for DB):", todayRange.startISOString);
  console.log("🌆 Schedule End of day (UTC for DB):", todayRange.endISOString);

  if (filters.date === "today" || filters.range === "today") {
    query.start = { $gte: todayRange.start, $lte: todayRange.end };
  }

  if (filters.range === "past") {
    query.start = { $lt: todayRange.start };
  }

  if (filters.range === "future") {
    query.start = { $gt: todayRange.end };
  }

  if (filters.date && filters.date !== "today") {
    const specificDateRange = timezoneService.getDayRangeUTC(new Date(filters.date));
    query.start = { $gte: specificDateRange.start, $lte: specificDateRange.end };
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
export async function getCalenderService(userId,start,end){
  return Schedule.find({
    createdBy: userId,
    start: {
      $lte: new Date(end),   // event starts before range ends
    },
    end: {
      $gte: new Date(start), // event ends after range starts
    },
  })
    .sort({ start: 1 })
    .lean();
}

export async function markdoneSchedule(scheduleId) {
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) throw new Error("Schedule not found");
  schedule.status = "completed";
  return schedule.save();
}