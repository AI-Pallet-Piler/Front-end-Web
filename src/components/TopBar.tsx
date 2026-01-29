import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      {/* LEFT: PAGE / APP TITLE */}
      <h1 className="text-xl font-semibold text-slate-900">
        Warehouse Management
      </h1>

      {/* RIGHT: actions */}
      <div className="flex items-center gap-6">
        {/* Notification bell */}
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6 text-slate-600" />

          {/* Red dot */}
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0)}
          </div>

          {/* Name + role */}
          <div className="leading-tight">
            <div className="text-sm font-medium text-slate-900">
              {user.name}
            </div>
            <div className="text-xs text-slate-500 capitalize">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
