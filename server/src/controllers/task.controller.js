import Task from "../models/Task.js";
import { created, fail, ok } from "../utils/response.js";

export async function createTask(req, res) {
  try {
    const { projectId, title, description, priority, dueDate } = req.body;
    if (!projectId || !title) return fail(res, 400, "projectId and title required");

    const task = await Task.create({
      projectId,
      title,
      description,
      priority,
      dueDate,
      createdBy: req.user.id,
    });

    return created(res, task, "Task created");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function getTasks(req, res) {
  try {
    const { projectId } = req.query;
    if (!projectId) return fail(res, 400, "projectId required");

    const tasks = await Task.find({ projectId, createdBy: req.user.id }).sort({ createdAt: -1 });
    return ok(res, tasks, "Tasks fetched");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) return fail(res, 404, "Task not found");
    return ok(res, task, "Task updated");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!task) return fail(res, 404, "Task not found");

    return ok(res, null, "Task deleted");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}
