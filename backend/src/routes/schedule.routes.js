import express from "express";

import { createScheduleController, getUserSchedule,markdoneScheduleController} from "../controllers/schedules.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createschedule",verifyUser,createScheduleController);
router.get("/myschedule",verifyUser,getUserSchedule);
router.put("/markdone/:scheduleId",verifyUser,markdoneScheduleController);

export default router;