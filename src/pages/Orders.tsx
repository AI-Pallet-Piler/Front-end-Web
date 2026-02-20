import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Package, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../config/api";

// Enums matching backend models
export enum OrderStatus {
  NEW = "NEW",
  PICKING = "PICKING",
  PACKING = "PACKING",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED",
}

// Type definitions matching backend Order model
export type Order = {
  order_id: number;
  order_number: string;
  customer_name?: string | null;
  status: OrderStatus;
  priority: number;
  created_at: string;
  completed_at?: string | null;
  promised_ship_date?: string | null;
};

export type OrderLine = {
  order_line_id: number;
  order_id: number;
  product_id: number;
  quantity_ordered: number;
  quantity_picked: number;
  product_name?: string;
  product_sku?: string;
};

// Extended order with order lines
export type OrderWithDetails = Order & {
  order_lines?: OrderLine[];
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles = {
    [OrderStatus.NEW]: "bg-blue-100 text-blue-700 border-blue-200",
    [OrderStatus.PICKING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [OrderStatus.PACKING]: "bg-orange-100 text-orange-700 border-orange-200",
    [OrderStatus.SHIPPED]: "bg-green-100 text-green-700 border-green-200",
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
  };

  const labels = {
    [OrderStatus.NEW]: "New",
    [OrderStatus.PICKING]: "Picking",
    [OrderStatus.PACKING]: "Packing",
    [OrderStatus.SHIPPED]: "Shipped",
    [OrderStatus.CANCELLED]: "Cancelled",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: number }) {
  const getStyles = () => {
    if (priority >= 3) return "bg-red-100 text-red-700 border-red-200";
    if (priority === 2) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getLabel = () => {
    if (priority >= 3) return "High";
    if (priority === 2) return "Medium";
    return "Normal";
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStyles()}`}>
      {getLabel()}
    </span>
  );
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return "—";
  }
}

function OrderDetailsModal({ 
  order, 
  onClose 
}: { 
  order: OrderWithDetails | null; 
  onClose: () => void 
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
            <p className="mt-1 text-sm text-slate-500">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Order Number</p>
                <p className="text-sm font-medium text-slate-900">{order.order_number}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Customer</p>
                <p className="text-sm font-medium text-slate-900">{order.customer_name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <StatusBadge status={order.status} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Priority</p>
                <PriorityBadge priority={order.priority} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Created At</p>
                <p className="text-sm font-medium text-slate-900">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Promised Ship Date</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatDate(order.promised_ship_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Lines */}
          {order.order_lines && order.order_lines.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Order Items</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs text-slate-500">
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">SKU</th>
                      <th className="px-4 py-3 font-semibold text-right">Ordered</th>
                      <th className="px-4 py-3 font-semibold text-right">Picked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.order_lines.map((line) => (
                      <tr key={line.order_line_id} className="text-sm">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {line.product_name || `Product #${line.product_id}`}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {line.product_sku || "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          {line.quantity_ordered}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={
                              line.quantity_picked >= line.quantity_ordered
                                ? "text-green-600 font-medium"
                                : "text-slate-600"
                            }
                          >
                            {line.quantity_picked}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  // Details modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/orders`);
        if (!res.ok) {
          // If endpoint doesn't exist yet, use mock data for testing
          if (res.status === 404) {
            console.warn("Orders endpoint not found, using mock data");
            setOrders(getMockOrders());
            return;
          }
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Use mock data as fallback
        setOrders(getMockOrders());
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Filter by search
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      new: orders.filter((o) => o.status === OrderStatus.NEW).length,
      picking: orders.filter((o) => o.status === OrderStatus.PICKING).length,
      packing: orders.filter((o) => o.status === OrderStatus.PACKING).length,
      shipped: orders.filter((o) => o.status === OrderStatus.SHIPPED).length,
      highPriority: orders.filter((o) => o.priority >= 3).length,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Order Management</h1>
          <p className="mt-2 text-slate-500">Track and manage customer orders</p>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">New Orders</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.new}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">{stats.new}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.picking + stats.packing}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-sm font-bold text-yellow-600">
                {stats.picking + stats.packing}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">High Priority</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.highPriority}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* HIGH PRIORITY ALERT */}
      {stats.highPriority > 0 && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-red-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Attention Required:</span>{" "}
            {stats.highPriority} high priority order{stats.highPriority === 1 ? "" : "s"} need
            {stats.highPriority === 1 ? "s" : ""} immediate attention.
          </div>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* SEARCH & FILTERS */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders by order number or customer name..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.NEW)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === OrderStatus.NEW
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.PICKING)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === OrderStatus.PICKING
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Picking
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.PACKING)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === OrderStatus.PACKING
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Packing
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.SHIPPED)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === OrderStatus.SHIPPED
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.CANCELLED)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === OrderStatus.CANCELLED
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium">No orders found</p>
              <p className="mt-1 text-sm">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No orders available"}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[980px] table-fixed">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold w-40">Order Number</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold w-32">Status</th>
                  <th className="px-6 py-4 font-semibold w-28">Priority</th>
                  <th className="px-6 py-4 font-semibold w-48">Created At</th>
                  <th className="px-6 py-4 font-semibold w-48">Ship Date</th>
                  <th className="px-6 py-4 font-semibold text-right w-28">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-slate-50">
                    <td className="px-6 py-5 font-mono text-slate-700 whitespace-nowrap">
                      {order.order_number}
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">
                        {order.customer_name || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-5">
                      <PriorityBadge priority={order.priority} />
                    </td>

                    <td className="px-6 py-5 text-slate-700 whitespace-nowrap text-sm">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="px-6 py-5 text-slate-700 whitespace-nowrap text-sm">
                      {formatDate(order.promised_ship_date)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer hover:text-blue-600"
                          title="View order details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 text-sm text-slate-500 flex items-center justify-between">
          <span>
            Showing <span className="font-medium">{filteredOrders.length}</span> result
            {filteredOrders.length === 1 ? "" : "s"}
          </span>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* DETAILS MODAL */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

// Mock data generator for testing when API is not available
function getMockOrders(): OrderWithDetails[] {
  return [
    {
      order_id: 1,
      order_number: "ORD-2026-001",
      customer_name: "Acme Corporation",
      status: OrderStatus.NEW,
      priority: 3,
      created_at: "2026-02-14T08:30:00Z",
      promised_ship_date: "2026-02-15T16:00:00Z",
      order_lines: [
        {
          order_line_id: 1,
          order_id: 1,
          product_id: 1,
          quantity_ordered: 10,
          quantity_picked: 0,
          product_name: "Widget A",
          product_sku: "WGT-A-001",
        },
        {
          order_line_id: 2,
          order_id: 1,
          product_id: 2,
          quantity_ordered: 5,
          quantity_picked: 0,
          product_name: "Widget B",
          product_sku: "WGT-B-002",
        },
      ],
    },
    {
      order_id: 2,
      order_number: "ORD-2026-002",
      customer_name: "Tech Solutions Inc",
      status: OrderStatus.PICKING,
      priority: 2,
      created_at: "2026-02-13T14:20:00Z",
      promised_ship_date: "2026-02-16T12:00:00Z",
      order_lines: [
        {
          order_line_id: 3,
          order_id: 2,
          product_id: 3,
          quantity_ordered: 20,
          quantity_picked: 15,
          product_name: "Component X",
          product_sku: "CMP-X-100",
        },
      ],
    },
    {
      order_id: 3,
      order_number: "ORD-2026-003",
      customer_name: "Global Retail Co",
      status: OrderStatus.PACKING,
      priority: 1,
      created_at: "2026-02-12T10:15:00Z",
      promised_ship_date: "2026-02-14T18:00:00Z",
      order_lines: [
        {
          order_line_id: 4,
          order_id: 3,
          product_id: 4,
          quantity_ordered: 50,
          quantity_picked: 50,
          product_name: "Box Set Pro",
          product_sku: "BOX-PRO-500",
        },
      ],
    },
    {
      order_id: 4,
      order_number: "ORD-2026-004",
      customer_name: "Distribution Partners",
      status: OrderStatus.SHIPPED,
      priority: 1,
      created_at: "2026-02-10T09:00:00Z",
      promised_ship_date: "2026-02-13T10:00:00Z",
      order_lines: [],
    },
    {
      order_id: 5,
      order_number: "ORD-2026-005",
      customer_name: "Quick Mart",
      status: OrderStatus.NEW,
      priority: 3,
      created_at: "2026-02-14T11:45:00Z",
      promised_ship_date: "2026-02-15T09:00:00Z",
      order_lines: [],
    },
  ];
}
