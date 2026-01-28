import { NavLink } from "react-router-dom";
import { LogOut, Warehouse } from "lucide-react";
import { navItems, type UserRole } from "../data/navItems";

export function Sidebar({
  role,
  brandName = "WMS Platform",
  roleLabel,
  onLogout,
}: {
  role: UserRole;
  brandName?: string;
  roleLabel?: string;
  onLogout?: () => void;
}) {
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  return (
    <aside className="h-screen w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-white/10">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <Warehouse className="h-5 w-5 text-blue-400" />
          </div>

          <div className="leading-tight">
            <div className="text-xl font-semibold tracking-wide">{brandName}</div>
            <div className="text-sm text-slate-400">
              {roleLabel ?? role.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* Nav */}
      <nav className="px-4 py-5 flex-1">
        <ul className="space-y-2">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-4 rounded-xl px-4 py-3 transition",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-200 hover:bg-white/5",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={[
                        "h-5 w-5",
                        isActive ? "text-white" : "text-slate-300 group-hover:text-white",
                      ].join(" ")}
                    />
                    <span className="text-base font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5 transition"
          type="button"
        >
          <LogOut className="h-5 w-5 text-slate-300" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
