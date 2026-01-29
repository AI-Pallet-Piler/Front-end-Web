export default function Footer() {
  const year = new Date().getFullYear();

  return (
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
  );
}