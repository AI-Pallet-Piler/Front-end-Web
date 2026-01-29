import { Link } from "react-router-dom";
import { AlertTriangle, Package, ShoppingCart } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
};

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>

      <div className="mt-6 text-slate-500 text-sm">{title}</div>
      <div className="mt-2 text-4xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  // fetch these from Python API
  const totalProducts = 5;
  const activeOrders = 23;
  const lowStockItems = 2;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-3 text-lg text-slate-500">
        Welcome to your warehouse management overview
      </p>

      {/* Low stock alert */}
      <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <div className="text-slate-800">
          <span className="font-semibold text-slate-900">Low Stock Alert:</span>{" "}
          You have <span className="font-semibold">{lowStockItems}</span> items
          running low on stock.{" "}
          <Link
            to="/inventory"
            className="text-orange-700 underline underline-offset-2 font-medium"
          >
            View Inventory
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="h-7 w-7 text-blue-600" />}
        />

        <StatCard
          title="Active Orders"
          value={activeOrders}
          icon={<ShoppingCart className="h-7 w-7 text-green-600" />}
        />

        <StatCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={<AlertTriangle className="h-7 w-7 text-orange-600" />}
        />
      </div>
    </div>
  );
}
