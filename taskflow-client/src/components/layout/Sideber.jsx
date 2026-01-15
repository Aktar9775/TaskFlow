import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-lg font-bold">
          Task<span className="text-gray-500">Flow</span>
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                 ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

