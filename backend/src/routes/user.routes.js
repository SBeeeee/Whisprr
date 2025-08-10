import express from "express";

import { register,login,logout,getProfile } from "../controllers/User.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", verifyUser, getProfile);

export default router;
