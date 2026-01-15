import Project from "../../../server/src/models/Projects.js";
import { created, fail, ok } from "../utils/response.js";

export async function createProject(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return fail(res, 400, "Project name is required");

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    return created(res, project, "Project created");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function getProjects(req, res) {
  try {
    const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return ok(res, projects, "Projects fetched");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) return fail(res, 404, "Project not found");
    return ok(res, project, "Project updated");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!project) return fail(res, 404, "Project not found");

    return ok(res, null, "Project deleted");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}
