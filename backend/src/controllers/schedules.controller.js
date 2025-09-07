import {
    createSchedule,
    getSchedulesWithFilters
  } from "../Services/schedule.services.js";
  
  export async function createScheduleController(req, res) {
    try {
      const scheduleData = { ...req.body, createdBy: req.id };
      const schedule = await createSchedule(scheduleData);
      res.status(201).json({ success: true, data: schedule });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  export async function getUserSchedule(req, res) {
    try {
      const { date, range, search, label, status, priority } = req.query;
      const schedules = await getSchedulesWithFilters(req.id, {
        date,
        range,
        search,
        label,
        status,
        priority,
      });
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

