import { createTaskController,getTaskController,
    getUserTasksController,
    updateTaskController,
    deleteTaskController,
    MarkasDoneController,ShiftToTommorowController } from "../controllers/tasks.comtroller.js";
import express from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyUser, createTaskController);
router.get("/", verifyUser, getUserTasksController);
router.get("/:id", verifyUser, getTaskController);
router.put("/update/:id", verifyUser, updateTaskController);
router.delete("/delete/:id", verifyUser, deleteTaskController);
router.put("/markdone/:id", verifyUser, MarkasDoneController);
router.put("/shifttotomorrow/:id", verifyUser, ShiftToTommorowController);

export default router;