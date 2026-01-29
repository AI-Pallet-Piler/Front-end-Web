import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import TopBar from "./TopBar";
import Footer from "./Footer";

const year = new Date().getFullYear();
const Layout = () => {
  const { user } = useAuth();

  if (!user) return <div className="p-8">Not authenticated</div>;

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="shrink-0">
        <Sidebar role={user.role} />
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-slate-100 text-slate-800">
        {/* TOP BAR */}
        <TopBar />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-10 py-8 overflow-y-auto">
          <div className="max-w-6xl">
            <Outlet />
          </div>
        </main>

        {/* FOOTER ZONE */}
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
