import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { loginRateLimit } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", loginRateLimit(5, 60), login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);

export default router;
