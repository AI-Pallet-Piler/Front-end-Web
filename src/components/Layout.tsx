import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";

const year = new Date().getFullYear();
const Layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8">Not authenticated</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="shrink-0">
        <Sidebar role={user.role} />
      </aside>

      {/* RIGHT SIDE: header + main + footer */}
      <div className="flex-1 flex flex-col">
        {/* FUTURE TOP BAR ZONE */}
        <header className="h-16 bg-white text-slate-800 border-b border-slate-200 flex items-center justify-center border-2 border-dashed border-blue-300 m-2 rounded-md">
          <span className="text-blue-400 font-mono text-sm">
            [ Top Bar Placeholder ]
          </span>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* FUTURE FOOTER ZONE */}
    <footer className="h-16 bg-slate-900 text-slate-300 border-t border-white/10 px-8 flex items-center justify-center">
      <span className="text-sm">
        <span className="font-semibold text-white">WMS Platform</span>
        <span className="text-slate-400">
          {" "}
          — Warehouse Management © {year}
        </span>
        <span className="text-slate-500"> • v0.1 (MVP)</span>
      </span>
    </footer>
      </div>
    </div>
  );
};

export default Layout;
