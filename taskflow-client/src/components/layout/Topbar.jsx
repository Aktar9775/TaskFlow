import { Menu, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Topbar({ onMenuClick }) {
  const {user} = useSelector((s)=>s.auth);
  
  
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      {/* Left - Menu + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-xl p-2 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <div className="font-bold text-gray-900 text-lg">
          Task<span className="text-gray-500">Flow</span>
        </div>
      </div>

      {/* Middle - Search */}
      <div className="hidden md:flex w-420px">
        <div className="flex w-full items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-sm">
          <Search size={18} className="text-gray-500" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Search projects, tasks..."
          />
        </div>
      </div>

      {/* Right - Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-sm font-semibold text-gray-900">{`${user.email}`}</span>
          <span className="text-xs text-gray-500">{`${user.role}`}</span>
        </div>

        <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
          S
        </div>
      </div>
    </div>
  );
}
