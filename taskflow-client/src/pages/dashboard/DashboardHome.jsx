import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../features/projects/projectsSlice";
import { fetchTasks } from "../../features/tasks/taskSlice";
import { mapGithubRepoToProject } from "../../features/github/githubMapper";


import GithubModals from "../../features/github/GithubModals";
import {
  fetchGithubProfile,
  fetchGithubRepos,
  setGithubUsername,
} from "../../features/github/githubSlice";
import toast from "react-hot-toast";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  ListChecks,
  Github,
  Linkedin,
  TrendingUp,
} from "lucide-react";

export default function DashboardHome() {
  const dispatch = useDispatch();
  const [gitModal, setGitModal] = useState(false);


  const { list: projects, loading: projectLoading } = useSelector(
    (s) => s.projects
  );

  const { list: tasks, loading: taskLoading } = useSelector((s) => s.tasks);

  const { user } = useSelector((s) => s.auth);

  const { username, profile, repos } = useSelector((s) => s.github);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
  if (!user?._id) return;

  const savedUsername = localStorage.getItem(`githubUsername_${user._id}`);
  if (savedUsername) {
    dispatch(fetchGithubProfile(savedUsername));
    dispatch(fetchGithubRepos(savedUsername));
  }
}, [user]);

  useEffect(() => {
    if (projects?.length > 0) {
      dispatch(fetchTasks(projects[0]._id));
    }
  }, [projects, dispatch]);

  const githubProjects = useMemo(() => {
    return (repos || []).map(mapGithubRepoToProject);
  }, [repos]);

  const allProjects = useMemo(() => {
    return [...(projects || []), ...githubProjects].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    );
  }, [projects, githubProjects]);

  const stats = useMemo(() => {
    const dbProjectCount = projects?.length || 0;
    const githubRepoCount = repos?.length || 0;
    const totalProjects = dbProjectCount + githubRepoCount;

    const totalTasks = tasks?.length || 0;

    const done = tasks.filter((t) => t.status === "DONE").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todo = tasks.filter((t) => t.status === "TODO").length;

    const completionRate =
      totalTasks === 0 ? 0 : Math.round((done / totalTasks) * 100);

    return {
      totalProjects,
      dbProjectCount,
      githubRepoCount,
      totalTasks,
      done,
      inProgress,
      todo,
      completionRate,
    };
  }, [projects, repos, tasks]);

  const isLoading = projectLoading || taskLoading;

  // ✅ Handle click project
  const handleProjectClick = (p) => {
    if (p?.source === "GITHUB") return;
    dispatch(fetchTasks(p._id));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome{user?.email ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your project summary and performance .
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-2">
          {/* ✅ GitHub account button */}
          {username ? (
            <a
              href={profile?.html_url || `https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition"
            >
              <img
                src={profile?.avatar_url}
                alt="github"
                className="h-6 w-6 rounded-full"
              />
              <span className="hidden sm:inline">{username}</span>
            </a>
          ) :  (
          <button
            onClick={() => setGitModal(true)}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            <Github size={18} />
            Import GitHub
          </button>
        
          )}

          <SocialButton
            href="https://www.linkedin.com/"
            icon={<Linkedin size={18} />}
            label="LinkedIn"
          />
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<FolderKanban size={20} />}
          loading={isLoading}
        />
        <StatCard
          title="TaskFlow Projects"
          value={stats.dbProjectCount}
          icon={<FolderKanban size={20} />}
          loading={isLoading}
        />
        <StatCard
          title="GitHub Repos"
          value={stats.githubRepoCount}
          icon={<Github size={20} />}
          loading={false}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock3 size={20} />}
          loading={isLoading}
        />
        <StatCard
          title="Completed"
          value={stats.done}
          icon={<CheckCircle2 size={20} />}
          loading={isLoading}
        />
      </div>

      {/* Performance + Projects */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* ✅ Performance (Fixed height) */}
        <div className="lg:col-span-1 rounded-3xl border bg-white p-6 shadow-sm h-[420px] flex flex-col">
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-gray-100 p-2">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Performance</h2>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Task completion performance.
          </p>

          <div className="mt-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-gray-700">Completion Rate</span>
              <span className="text-gray-900">{stats.completionRate}%</span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>

            {/* Breakdown */}
            <div className="mt-6 space-y-2 text-sm">
              <Breakdown label="TODO" value={stats.todo} />
              <Breakdown label="IN_PROGRESS" value={stats.inProgress} />
              <Breakdown label="DONE" value={stats.done} />
            </div>
          </div>
        </div>

        {/* ✅ Recent Projects (Fixed height + inner scroll) */}
        <div className="lg:col-span-2 rounded-3xl border bg-white p-6 shadow-sm h-[420px] flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
            <span className="text-sm text-gray-500">
              Total: {stats.totalProjects}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2">Latest projects</p>

          {/* Loading */}
          {projectLoading && (
            <p className="mt-6 text-gray-500">Loading projects...</p>
          )}

          {/* ✅ Scrollable List */}
          <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-3">
            {allProjects.slice(0, 50).map((p) => (
              <button
                key={p._id}
                onClick={() => handleProjectClick(p)}
                className="w-full rounded-2xl border p-4 text-left hover:bg-gray-50 transition flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {p.description || "No description"}
                  </p>

                  {/* GitHub meta */}
                  {p.source === "GITHUB" && (
                    <p className="mt-2 text-xs text-gray-500">
                      ⭐ {p.stars || 0} • 🍴 {p.forks || 0}
                    </p>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    p.source === "GITHUB"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {p.source === "GITHUB" ? "GITHUB" : "TaskFlow"}
                </span>
              </button>
            ))}

            {/* Empty */}
            {!projectLoading && allProjects.length === 0 && (
              <div className="mt-10 rounded-3xl border bg-gray-50 p-8 text-center">
                <h3 className="font-bold text-gray-900">No Projects Found</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Create a project in Projects page or connect GitHub.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ✅ GitHub Link Modal */}
<GithubModals
  open={gitModal}
  onClose={() => setGitModal(false)}
  onSubmit={(u) => {
   dispatch(setGithubUsername({ userId: user._id, username: u }));
    dispatch(fetchGithubProfile(u));
    dispatch(fetchGithubRepos(u));
    toast.success("GitHub Connected ✅");
    setGitModal(false);
  }}
/>

    </DashboardLayout>
  );
}
/* ----------- Components ----------- */

function StatCard({ title, value, icon, loading }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-2xl bg-gray-100 p-2 text-gray-900">{icon}</div>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900">
        {loading ? "..." : value}
      </p>
    </div>
  );
}

function Breakdown({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function SocialButton({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
