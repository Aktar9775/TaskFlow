import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import TaskModal from "../../features/tasks/taskModals"; // 
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// ✅ use correct slice import names
import { fetchProjects } from "../../features/projects/projectsSlice";

import {
  clearTasks,
  createTask,
  deleteTask,
  fetchTasks,
  setSelectedProject,
  updateTask,
} from "../../features/tasks/taskSlice";

// ✅ GitHub repos mapping
import { mapGithubRepoToProject } from "../../features/github/githubMapper";

export default function Tasks() {
  const dispatch = useDispatch();

  // ✅ DB projects
  const { list: projects } = useSelector((s) => s.projects);

  // ✅ GitHub repos
  const { repos, username } = useSelector((s) => s.github);

  // ✅ tasks
  const { list: tasks, loading, error, selectedProjectId } = useSelector(
    (s) => s.tasks
  );

  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // ✅ merge DB projects + GitHub repos
  const githubProjects = useMemo(() => {
    return (repos || []).map(mapGithubRepoToProject);
  }, [repos]);

  const combinedProjects = useMemo(() => {
    return [...(projects || []), ...githubProjects];
  }, [projects, githubProjects]);

  const isGithubProject = selectedProjectId?.startsWith("github-");

  // ✅ Fetch projects on load
  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  // ✅ Task fetching rules:
  // - if no project -> clear
  // - if github project -> clear tasks (no backend tasks)
  // - if db project -> fetch tasks
  useEffect(() => {
    if (!selectedProjectId) {
      dispatch(clearTasks());
      return;
    }

    if (isGithubProject) {
      dispatch(clearTasks());
      return;
    }

    dispatch(fetchTasks(selectedProjectId));
  }, [selectedProjectId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const grouped = useMemo(() => {
    return {
      TODO: tasks.filter((t) => t.status === "TODO"),
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
      DONE: tasks.filter((t) => t.status === "DONE"),
    };
  }, [tasks]);

  const handleCreate = async (data) => {
    if (!selectedProjectId) return toast.error("Select a project first");

    if (isGithubProject) {
      return toast.error("GitHub projects are view-only. Select a DB project to create tasks.");
    }

    const payload = {
      projectId: selectedProjectId,
      ...data,
      dueDate: data.dueDate || null,
    };

    const res = await dispatch(createTask(payload));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Task created ✅");
      setOpen(false);
    }
  };

  const handleUpdate = async (data) => {
    if (isGithubProject) return;

    const res = await dispatch(updateTask({ id: editTask._id, data }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Task updated ✅");
      setEditTask(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (isGithubProject) return;

    if (!confirm("Delete this task?")) return;
    const res = await dispatch(deleteTask(id));
    if (res.meta.requestStatus === "fulfilled") toast.success("Task deleted ✅");
  };

  const changeStatus = async (taskId, newStatus) => {
    if (isGithubProject) return;
    await dispatch(updateTask({ id: taskId, data: { status: newStatus } }));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage tasks using Kanban workflow.
          </p>
        </div>

        <div className="flex gap-2">
          {/* Project dropdown */}
          <select
            value={selectedProjectId}
            onChange={(e) => dispatch(setSelectedProject(e.target.value))}
            className="rounded-xl border bg-white px-4 py-3 text-sm"
          >
            <option value="">Select Project</option>

            {/* DB Projects */}
            {projects?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}

            {/* GitHub Projects */}
            {username && githubProjects.length > 0 && (
              <optgroup label="GitHub Projects">
                {githubProjects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} • GitHub
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Create Task */}
          <button
            onClick={() => {
              if (!selectedProjectId) return toast.error("Select a project first");

              if (isGithubProject) {
                return toast.error("GitHub projects are view-only. Select a DB project.");
              }

              setEditTask(null);
              setOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* GitHub project warning */}
      {isGithubProject && (
        <div className="mt-6 rounded-3xl border bg-white p-6">
          <h3 className="font-bold text-gray-900">GitHub Project Selected</h3>
          <p className="text-sm text-gray-500 mt-2">
            This project is imported from GitHub and is not stored in the database.
            Task management is available only for database projects.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && !isGithubProject && (
        <p className="mt-6 text-gray-500">Loading tasks...</p>
      )}

      {/* Empty */}
      {!loading && selectedProjectId && !isGithubProject && tasks.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-8 border text-center">
          <h3 className="text-lg font-bold text-gray-900">No Tasks Found</h3>
          <p className="text-sm text-gray-500 mt-2">
            Create your first task for this project.
          </p>
        </div>
      )}

      {/* Kanban */}
      {selectedProjectId && !isGithubProject && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <KanbanColumn
            title="To Do"
            tasks={grouped.TODO}
            onEdit={(t) => {
              setEditTask(t);
              setOpen(true);
            }}
            onDelete={handleDelete}
            onMove={changeStatus}
          />

          <KanbanColumn
            title="In Progress"
            tasks={grouped.IN_PROGRESS}
            onEdit={(t) => {
              setEditTask(t);
              setOpen(true);
            }}
            onDelete={handleDelete}
            onMove={changeStatus}
          />

          <KanbanColumn
            title="Done"
            tasks={grouped.DONE}
            onEdit={(t) => {
              setEditTask(t);
              setOpen(true);
            }}
            onDelete={handleDelete}
            onMove={changeStatus}
          />
        </div>
      )}

      {/* Modal */}
      <TaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={editTask ? handleUpdate : handleCreate}
        initialData={editTask}
      />
    </DashboardLayout>
  );
}

function KanbanColumn({ title, tasks, onEdit, onDelete, onMove }) {
  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100">
          {tasks.length}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="rounded-2xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{t.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Priority: <span className="font-semibold">{t.priority}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(t)}
                  className="p-2 rounded-xl hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(t._id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Move buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onMove(t._id, "TODO")}
                className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
              >
                TODO
              </button>
              <button
                onClick={() => onMove(t._id, "IN_PROGRESS")}
                className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
              >
                IN_PROGRESS
              </button>
              <button
                onClick={() => onMove(t._id, "DONE")}
                className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
              >
                DONE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
