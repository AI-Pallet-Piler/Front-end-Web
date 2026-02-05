import { useMemo, useState } from "react";
import { AlertTriangle, Eye, MapPin, Search } from "lucide-react";
import ViewInventoryModal from "../components/ViewInventoryModal";

/**
 * =========================================================
 * TODO (Backend) - View Inventory Page
 * =========================================================
 * 1) Replace mock data with API call:
 *    - GET /api/inventory
 *
 * 2) Response should include JOINED product + location fields so the modal
 *    can quickly show all info without extra requests:
 *    inventory_id, product_id, location_id, quantity,
 *    sku, product_name, product_description, location_code
 *
 *    Recommended response:
 *    [
 *      {
 *        inventory_id: 1,
 *        product_id: 10,
 *        location_id: 5,
 *        quantity: 45,
 *        sku: "PRD-001",
 *        product_name: "Industrial Laptop",
 *        product_description: "Rugged device for warehouse operations",
 *        location_code: "A-12-03"
 *      }
 *    ]
 *
 * 3) later: server-side search:
 *    - GET /api/inventory?q=helmet
 *
 * 4) backend features:
 *    - Edit/Adjust stock:
 *        A) PUT /api/inventory/:id  { quantity: number, location_id?: number }
 *        B) POST /api/inventory/adjust { inventory_id, delta, reason }
 *    - Delete inventory row:
 *        DELETE /api/inventory/:id
 *    - Pagination + sorting server-side
 * =========================================================
 */

export type InventoryRow = {
  inventory_id: number;
  product_id: number;
  location_id: number;

  sku: string;
  product_name: string;
  product_description?: string | null;

  quantity: number;
  location_code: string; // e.g. "A-12-03"
};

const LOW_STOCK_THRESHOLD = 20;

const mockInventory: InventoryRow[] = [
  {
    inventory_id: 1,
    product_id: 1,
    location_id: 101,
    sku: "PRD-001",
    product_name: "Industrial Laptop",
    product_description: "Rugged device for warehouse operations",
    quantity: 45,
    location_code: "A-12-03",
  },
  {
    inventory_id: 2,
    product_id: 2,
    location_id: 102,
    sku: "PRD-002",
    product_name: "Safety Helmets",
    product_description: "PPE",
    quantity: 15,
    location_code: "B-05-02",
  },
  {
    inventory_id: 3,
    product_id: 3,
    location_id: 103,
    sku: "PRD-003",
    product_name: "Chemical Cleaner",
    product_description: "Industrial cleaning chemical",
    quantity: 8,
    location_code: "C-01-01",
  },
  {
    inventory_id: 4,
    product_id: 4,
    location_id: 104,
    sku: "PRD-004",
    product_name: "Office Desk",
    product_description: null,
    quantity: 120,
    location_code: "D-10-05",
  },
  {
    inventory_id: 5,
    product_id: 5,
    location_id: 105,
    sku: "PRD-005",
    product_name: "LED Monitor",
    product_description: null,
    quantity: 65,
    location_code: "A-15-08",
  },
];

function StatusBadge({ qty }: { qty: number }) {
  const isLow = qty <= LOW_STOCK_THRESHOLD;

  const styles = isLow
    ? "bg-orange-100 text-orange-700 border-orange-200"
    : "bg-green-100 text-green-700 border-green-200";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}
    >
      {isLow ? "Low Stock" : "In Stock"}
    </span>
  );
}

export default function ViewInventory() {
  const [inventory, setInventory] = useState<InventoryRow[]>(mockInventory);
  const [search, setSearch] = useState("");

  // View modal
  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inventory;

    return inventory.filter(
      (r) =>
        r.product_name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.location_code.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((r) => r.quantity <= LOW_STOCK_THRESHOLD).length;
  }, [inventory]);

  /**
   * =========================================================
   * TODO (Backend) - Replace mock with API call
   * =========================================================
   * Example:
   *
   * useEffect(() => {
   *   (async () => {
   *     const res = await fetch("/api/inventory");
   *     const data = await res.json();
   *     setInventory(data);
   *   })();
   * }, []);
   *
   * If you support server-side search later:
   * - fetch(`/api/inventory?q=${encodeURIComponent(search)}`)
   * =========================================================
   */

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Inventory Management
          </h1>
          <p className="mt-2 text-slate-500">
            Monitor and manage warehouse stock levels
          </p>
        </div>
        {/* create action buttons */}
      </div>

      {/* LOW STOCK BANNER */}
      {lowStockCount > 0 && (
        <div className="rounded-2xl bg-orange-50 border border-orange-200 px-5 py-4 text-orange-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Low Stock Alert:</span>{" "}
            {lowStockCount} item{lowStockCount === 1 ? "" : "s"} are running low
            on stock and require restocking.
            {/* TODO (Backend later): threshold configurable per warehouse */}
          </div>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* SEARCH */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory by product name, SKU or location..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/**
           * TODO (Backend optional):
           * If you add server-side search:
           * - debounce search input
           * - call GET /api/inventory?q=...
           */}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed">
            <thead>
              <tr className="text-left text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-semibold w-36">SKU</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold w-28">Quantity</th>
                <th className="px-6 py-4 font-semibold w-40">Location</th>
                <th className="px-6 py-4 font-semibold w-32">Status</th>
                <th className="px-6 py-4 font-semibold text-right w-28">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.inventory_id} className="hover:bg-slate-50">
                  <td className="px-6 py-5 font-mono text-slate-700 whitespace-nowrap">
                    {r.sku}
                  </td>

                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-900 leading-tight">
                      {r.product_name}
                    </div>
                    <div className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {r.product_description || "—"}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {r.quantity}
                      </span>

                      {r.quantity <= LOW_STOCK_THRESHOLD && (
                        <span className="text-orange-600 text-xs font-semibold">
                          ↓
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-slate-700 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{r.location_code}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge qty={r.quantity} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {/* VIEW INVENTORY DETAILS (MODAL) */}
                      <button
                        type="button"
                        onClick={() => setSelectedRow(r)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 cursor-pointer hover:text-blue-600"
                        title="View inventory details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>

                      {/**
                       * TODO:
                       * - Add "Edit" action
                       * - Add "Delete row" action + confirm modal
                       */}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-slate-400"
                  >
                    No inventory rows match “{search}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 text-sm text-slate-500 flex items-center justify-between">
          <span>
            Showing <span className="font-medium">{filtered.length}</span> result
            {filtered.length === 1 ? "" : "s"}
          </span>
          <span className="hidden sm:block">
            Low stock threshold: {LOW_STOCK_THRESHOLD}
          </span>
        </div>
      </div>

      {/* VIEW MODAL */}
      <ViewInventoryModal row={selectedRow} onClose={() => setSelectedRow(null)} />

      {/**
       * TODO (Backend + UX later):
       * - If inventory rows can have multiple locations per product, decide how to display:
       *    A) one row per product per location (current approach)
       *    B) group by product and show expandable locations list
       */}
    </div>
  );
}
