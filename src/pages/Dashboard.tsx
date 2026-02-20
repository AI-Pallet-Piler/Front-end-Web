import { useEffect, useState, useMemo } from "react";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Package, ShoppingCart, CheckCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { OrderStatus } from "./Orders";
import { AlertTriangle, Package, ShoppingCart, CheckCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { OrderStatus } from "./Orders";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading?: boolean;
  isLoading?: boolean;
};

function StatCard({ title, value, icon, isLoading }: StatCardProps) {
function StatCard({ title, value, icon, isLoading }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>

      <div className="mt-6 text-slate-500 text-sm">{title}</div>
      <div className="mt-2 text-4xl font-semibold text-slate-900">
        {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-slate-400" /> : value}
      </div>
      <div className="mt-2 text-4xl font-semibold text-slate-900">
        {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-slate-400" /> : value}
      </div>
    </div>
  );
}

type Order = {
  order_id: number;
  status: OrderStatus;
  completed_at?: string | null;
};

type Product = {
  product_id: number;
};

type InventoryItem = {
  inventory_id: number;
  quantity: number;
};

const LOW_STOCK_THRESHOLD = 10;

type Order = {
  order_id: number;
  status: OrderStatus;
  completed_at?: string | null;
};

type Product = {
  product_id: number;
};

type InventoryItem = {
  inventory_id: number;
  quantity: number;
};

const LOW_STOCK_THRESHOLD = 10;

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, inventoryRes] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/orders`),
          fetch(`${API_BASE_URL}/v1/products`),
          fetch(`${API_BASE_URL}/v1/inventory`),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(Array.isArray(productsData) ? productsData : []);
        }

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (o) =>
        o.status === OrderStatus.NEW ||
        o.status === OrderStatus.PICKING ||
        o.status === OrderStatus.PACKING
    ).length;

    // Count orders completed today (shipped with completed_at today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = orders.filter((o) => {
      if (o.status !== OrderStatus.SHIPPED || !o.completed_at) return false;
      const completedDate = new Date(o.completed_at);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    const lowStockItems = inventory.filter(
      (item) => item.quantity > 0 && item.quantity < LOW_STOCK_THRESHOLD
    ).length;

    return {
      totalProducts: products.length,
      activeOrders,
      completedToday,
      lowStockItems,
    };
  }, [orders, products, inventory]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, inventoryRes] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/orders`),
          fetch(`${API_BASE_URL}/v1/products`),
          fetch(`${API_BASE_URL}/v1/inventory`),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(Array.isArray(productsData) ? productsData : []);
        }

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (o) =>
        o.status === OrderStatus.NEW ||
        o.status === OrderStatus.PICKING ||
        o.status === OrderStatus.PACKING
    ).length;

    // Count orders completed today (shipped with completed_at today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = orders.filter((o) => {
      if (o.status !== OrderStatus.SHIPPED || !o.completed_at) return false;
      const completedDate = new Date(o.completed_at);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    const lowStockItems = inventory.filter(
      (item) => item.quantity > 0 && item.quantity < LOW_STOCK_THRESHOLD
    ).length;

    return {
      totalProducts: products.length,
      activeOrders,
      completedToday,
      lowStockItems,
    };
  }, [orders, products, inventory]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-3 text-lg text-slate-500">
        Welcome to your warehouse management overview
      </p>

      {/* Low stock alert */}
      {stats.lowStockItems > 0 && (
        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div className="text-slate-800">
            <span className="font-semibold text-slate-900">Low Stock Alert:</span>{" "}
            You have <span className="font-semibold">{stats.lowStockItems}</span> items
            running low on stock.{" "}
            <Link
              to="/inventory"
              className="text-orange-700 underline underline-offset-2 font-medium"
            >
              View Inventory
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="h-7 w-7 text-blue-600" />}
          isLoading={isLoading}
        />

        <StatCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={<ShoppingCart className="h-7 w-7 text-yellow-600" />}
          isLoading={isLoading}
        />

        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={<CheckCircle className="h-7 w-7 text-green-600" />}
          isLoading={isLoading}
          value={stats.activeOrders}
          icon={<ShoppingCart className="h-7 w-7 text-green-600" />}
          isLoading={isLoading}
        />

        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={<CheckCircle className="h-7 w-7 text-emerald-600" />}
          isLoading={isLoading}
        />

        <StatCard
          title="Low Stock Items"
          value={stats.stats.lowStockItems}
          icon={<AlertTriangle className="h-7 w-7 text-orange-600" />}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
