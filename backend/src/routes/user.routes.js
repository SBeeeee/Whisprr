import express from "express";

import { register,login,logout,getProfile,settimercontroller,gettimercontroller,getAllUsers } from "../controllers/User.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", verifyUser, getProfile);
router.get("/gettimer", verifyUser, gettimercontroller);
router.post("/settimer", verifyUser, settimercontroller);
router.get("/allusers", getAllUsers);

export default router;
