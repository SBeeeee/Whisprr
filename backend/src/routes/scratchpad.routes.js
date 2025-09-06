import express from "express";

import { createController,getUserScratchPadcontroller,updatescratchpadController } from "../controllers/scratchpad.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router =express.Router();
router.post("/createscratchnotes",verifyUser,createController);
router.get("/getscratch",verifyUser,getUserScratchPadcontroller);
router.patch("/updatescratch",verifyUser,updatescratchpadController);

export default router;