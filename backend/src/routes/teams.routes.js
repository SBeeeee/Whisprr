import express from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { isTeamMember } from "../middlewares/isTeamMember.js";
import { isTeamAdmin } from "../middlewares/isTeamAdmin.js";
import { createTeamController,addMemberController,getTeamByIdController,getUserTeamsController,getTeamsDashboardController,getTeamTasksController } from "../controllers/teams.controllers.js";

const router =express.Router();

router.get("/dashboard",verifyUser,getTeamsDashboardController);
router.post("/create",verifyUser,createTeamController);
router.get("/myteams",verifyUser,getUserTeamsController);
router.get("/getteam/:teamId",verifyUser,isTeamMember,getTeamByIdController);
router.post("/addmember/:teamId",verifyUser,isTeamMember,isTeamAdmin,addMemberController);
router.get("/tasks/:teamId",verifyUser,isTeamMember,getTeamTasksController); 

export default router;