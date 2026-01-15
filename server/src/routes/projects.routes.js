import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
