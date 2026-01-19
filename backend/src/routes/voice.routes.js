import express from "express";
import { voiceCommandController } from "../controllers/voice.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/command",verifyUser,voiceCommandController);

export default router;