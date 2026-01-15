import { Router } from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./projects.routes.js";
import taskRoutes from "./task.routes.js";

const router = Router();
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);

export default router;
