import { createTaskController,getTaskController,
    getUserTasksController,
    updateTaskController,
    deleteTaskController,
    MarkasDoneController,ShiftToTommorowController } from "../controllers/tasks.comtroller.js";
import express from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { isTeamMember } from "../middlewares/isTeamMember.js";
import { canModifyTask } from "../middlewares/canModifyTask.js";

const router = express.Router();

router.post("/create", verifyUser,isTeamMember, createTaskController);
router.get("/", verifyUser, getUserTasksController);
router.get("/:id", verifyUser,canModifyTask, getTaskController);
router.put("/update/:id", verifyUser, canModifyTask,updateTaskController);
router.delete("/delete/:id", verifyUser, canModifyTask,deleteTaskController);
router.put("/markdone/:id", verifyUser,canModifyTask, MarkasDoneController);
router.put("/shifttotomorrow/:id", verifyUser, canModifyTask,ShiftToTommorowController);

export default router;