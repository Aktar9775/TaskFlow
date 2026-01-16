import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProjectModal from "../../features/projects/ProjectsModals";
import GithubModals from "../../features/github/GithubModals";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGithubProfile,
  fetchGithubRepos,
  fetchRepoDetails,
  setGithubUsername,
} from "../../features/github/githubSlice";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../../features/projects/projectsSlice";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Github, Unlink2 } from "lucide-react";
export default function Projects() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.projects);

  const [open, setOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const { username, profile, repos, repoDetails } = useSelector(
    (s) => s.github
  );
  const [gitModal, setGitModal] = useState(false);

  useEffect(() => {
    if (username) {
      dispatch(fetchGithubProfile(username));
      dispatch(fetchGithubRepos(username));
    }
  }, [username]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleCreate = async (data) => {
    const res = await dispatch(createProject(data));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Project created ✅");
      setOpen(false);
    }
  };

  const handleUpdate = async (data) => {
    const res = await dispatch(updateProject({ id: editProject._id, data }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Project updated ✅");
      setEditProject(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    const res = await dispatch(deleteProject(id));
    if (res.meta.requestStatus === "fulfilled")
      toast.success("Project deleted ✅");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage your projects.
          </p>
        </div>
        {/* GitHub button */} 
        <button
          onClick={() => {
            setEditProject(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="mt-6 text-gray-500">Loading projects...</p>}

      {/* Project Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div
            key={p._id}
            className="rounded-3xl bg-white p-5 border shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {p.description || "No description added."}
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100">
                {p.status}
              </span>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setEditProject(p);
                  setOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                <Pencil size={16} /> Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* ✅ GitHub Repositories */}
      {repos?.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">GitHub Projects</h2>
          {username ? (
          <button
            onClick={() =>
              window.open(
                profile?.html_url || `https://github.com/${username}`,
                "_blank"
              )
            }
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            <img
                src={profile?.avatar_url}
                alt="github"
                className="h-6 w-6 rounded-full"
              />
              <span className="hidden sm:inline">{username}</span>
          </button>
        ) : (
          <button
            onClick={() => setGitModal(true)}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            <Github size={18} />
            Import GitHub
          </button>
        )}
           
          </div>
          <p className="text-sm text-gray-500 mt-1">Imported from GitHub</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.slice(0, 9).map((r) => (
              <div
                key={r.id}
                className="rounded-3xl bg-white p-5 border shadow-sm"
              >
                <h3 className="text-lg font-bold">{r.name}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {r.description || "No description"}
                </p>

                <div className="mt-3 flex gap-2">
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-black underline"
                  >
                    View Repo
                  </a>

                  <button
                    onClick={() =>
                      dispatch(fetchRepoDetails({ username, repo: r.name }))
                    }
                    className="text-sm font-semibold text-gray-700 hover:underline"
                  >
                    View README
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {repoDetails && (
        <div className="mt-10 rounded-3xl border bg-white p-6">
          <h3 className="text-lg font-bold text-gray-900">
            README: {repoDetails.repo}
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Tech Stack:{" "}
            <span className="font-semibold text-gray-900">
              {repoDetails.languages.join(", ") || "Not detected"}
            </span>
          </p>

          <pre className="mt-4 whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-2xl border overflow-auto max-h-450px">
            {repoDetails.readme}
          </pre>
        </div>
      )}

      {/* Empty state */}
      {!loading && list.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-8 border text-center">
          <h3 className="text-lg font-bold text-gray-900">No Projects Found</h3>
          <p className="text-sm text-gray-500 mt-2">
            Create your first project to start managing tasks.
          </p>
        </div>
      )}

      {/* Modal */}
      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={editProject ? handleUpdate : handleCreate}
        initialData={editProject}
      />
      <GithubModals
        open={gitModal}
        onClose={() => setGitModal(false)}
        onSubmit={(u) => {
          dispatch(setGithubUsername(u));
          dispatch(fetchGithubProfile(u));
          dispatch(fetchGithubRepos(u));
          toast.success("GitHub Connected ✅");
          setGitModal(false);
        }}
      />

    </DashboardLayout>
  );
}
