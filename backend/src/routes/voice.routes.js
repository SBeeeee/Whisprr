import express from "express";
import { voiceCommandController,voiceConfirmationController } from "../controllers/voice.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/command",verifyUser,voiceCommandController);
router.post("/confirm", verifyUser, voiceConfirmationController); 
export default router;