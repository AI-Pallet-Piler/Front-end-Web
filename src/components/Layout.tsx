import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import TopBar from "./TopBar";

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

        {/* FOOTER (placeholder for now) */}
        <footer className="h-20 bg-slate-900 text-white flex items-center justify-center">
          <span className="text-red-300 font-mono text-sm">
            [ Footer Placeholder ]
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
