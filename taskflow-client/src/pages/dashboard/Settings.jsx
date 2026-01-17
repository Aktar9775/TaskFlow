import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { unlinkGithub,resetGithubState } from "../../features/github/githubSlice";
import { logout } from "../../features/auth/authSlice";
import { Github, Lock, User, LogOut, Trash2, Settings2, Unlink2 } from "lucide-react";
import GithubModal from "../../features/github/GithubModals";
import { fetchGithubProfile, fetchGithubRepos, setGithubUsername } from "../../features/github/githubSlice";

export default function Settings() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { username, profile, repos } = useSelector((s) => s.github);

  const [tab, setTab] = useState("profile");
  const [gitModal, setGitModal] = useState(false);

  // local UI states
  const [fullName, setFullName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSaveProfile = () => {
    // ⚠️ here you will later call backend API
    toast.success("Profile saved (UI) ✅");
  };

  const handleChangePassword = () => {
    if (!oldPass || !newPass || !confirmPass) return toast.error("Fill all fields");
    if (newPass !== confirmPass) return toast.error("Password not matching");

    // ⚠️ later backend call
    toast.success("Password updated (UI) ✅");

    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account, password and integrations.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1 rounded-3xl border bg-white p-4 shadow-sm h-fit">
          <TabButton
            active={tab === "profile"}
            onClick={() => setTab("profile")}
            icon={<User size={18} />}
            label="Profile"
          />

          <TabButton
            active={tab === "security"}
            onClick={() => setTab("security")}
            icon={<Lock size={18} />}
            label="Security"
          />

          <TabButton
            active={tab === "github"}
            onClick={() => setTab("github")}
            icon={<Github size={18} />}
            label="GitHub"
          />

          <TabButton
            active={tab === "account"}
            onClick={() => setTab("account")}
            icon={<Settings2 size={18} />}
            label="Account"
          />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 rounded-3xl border bg-white p-6 shadow-sm">
          {/* PROFILE */}
          {tab === "profile" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your basic profile details.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
                <InputField
                  label="Email"
                  value={email}
                  disabled
                  placeholder="Email"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500 mt-1">
                Change your password securely.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Old Password"
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="Enter old password"
                />
                <div />
                <InputField
                  label="New Password"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleChangePassword}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* GITHUB */}
          {tab === "github" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">GitHub Integration</h2>
              <p className="text-sm text-gray-500 mt-1">
                Connect GitHub to import repositories and README.
              </p>

              {/* Connected */}
              {username ? (
                <div className="mt-6 rounded-3xl border p-5 bg-gray-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile?.avatar_url}
                      alt="github"
                      className="h-12 w-12 rounded-2xl border"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{username}</p>
                      <p className="text-sm text-gray-500">
                        Repositories Imported: <span className="font-semibold">{repos?.length || 0}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!confirm("Unlink GitHub account?")) return;
                      dispatch(resetGithubState(user._id));
                      toast.success("GitHub unlinked ✅");
                    }}
                    className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Unlink2 size={18} />
                    Unlink
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border p-6 text-center">
                  <p className="font-semibold text-gray-900">No GitHub connected</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Connect your GitHub account to show repos inside your Projects.
                  </p>

                  <button
                    onClick={() => setGitModal(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <Github size={18} />
                    Connect GitHub
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT */}
          {tab === "account" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Account</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage logout or delete account actions.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Logout</p>
                    <p className="text-sm text-gray-500">
                      You will be redirected to login.
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>

                <div className="rounded-3xl border p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-red-700">Delete Account</p>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => toast.error("Unable to process this request")}
                    className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GitHub Modal */}
      <GithubModal
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

/* ---------- UI Components ---------- */

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition
          ${disabled ? "bg-gray-100" : "bg-white"}
          focus:border-black focus:ring-2 focus:ring-black/10
        `}
      />
    </div>
  );
}
