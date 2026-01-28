import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";

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
        <footer className="h-20 bg-slate-900 text-white flex items-center justify-center border-2 border-dashed border-red-400 m-2 rounded-md">
          <span className="text-red-300 font-mono text-sm">
            [ Footer Placeholder ]
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
