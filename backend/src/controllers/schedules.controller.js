import {
    createSchedule,
    getSchedulesWithFilters,
    markdoneSchedule,getCalenderService
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

  export async function getCalenderController(req,res){
    try {
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({
          success: false,
          message: "start and end query params are required",
        });
      }
     let startt = start.trim();
    let endd = end.trim();
      const schedules = await getCalenderService(
        req.id,
        startt,
        endd
      );
  
      res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  export async function markdoneScheduleController(req, res) {
    try {
      const { scheduleId } = req.params;
      const schedule = await markdoneSchedule(scheduleId);
      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }