import { useMemo, useState } from "react";
import { AlertTriangle, Eye, PackagePlus, Search } from "lucide-react";
import EditInventoryModal from "../components/EditInventoryModal";
import InventoryDetailsModal from "../components/InventoryDetailsModal";

/**
 * =========================================================
 * TODO (Backend) - View Inventory Page
 * =========================================================
 * 1) Replace mock data with API call:
 *    - GET /api/inventory
 *
 * 2) Save edits:
 *    - PUT/PATCH /api/inventory/:id  { locations: [{location_code, quantity}] }
 * =========================================================
 */

export type InventoryLocation = {
  location_code: string;
  quantity: number;
};

export type InventoryRow = {
  inventory_id: number;
  product_id: number;
  location_id: number;

  sku: string;
  product_name: string;
  product_description?: string | null;

  // old fields (still supported)
  quantity: number;
  location_code: string;

  // new multi-location
  locations?: InventoryLocation[];
};

const LOW_STOCK_THRESHOLD = 20;

// --- Helpers to support BOTH old + new shapes ---
function getLocations(r: InventoryRow): InventoryLocation[] {
  if (r.locations?.length) return r.locations;
  return r.location_code
    ? [{ location_code: r.location_code, quantity: r.quantity ?? 0 }]
    : [];
}

function getTotalQty(r: InventoryRow): number {
  return getLocations(r).reduce((sum, l) => sum + (l.quantity ?? 0), 0);
}

function StatusBadge({ qty }: { qty: number }) {
  const isLow = qty <= LOW_STOCK_THRESHOLD;
  const styles = isLow
    ? "bg-orange-100 text-orange-700 border-orange-200"
    : "bg-green-100 text-green-700 border-green-200";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {isLow ? "Low Stock" : "In Stock"}
    </span>
  );
}

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
    locations: [
      { location_code: "A-12-03", quantity: 45 },
      { location_code: "B-01-02", quantity: 10 },
      { location_code: "C-02-01", quantity: 5 },
    ],
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

export default function ViewInventory() {
  const [inventory, setInventory] = useState<InventoryRow[]>(mockInventory);
  const [search, setSearch] = useState("");

  // Edit modal state
  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);

  // Details modal state
  const [detailsRow, setDetailsRow] = useState<InventoryRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inventory;

    return inventory.filter((r) => {
      const locs = getLocations(r);
      return (
        r.product_name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        locs.some((l) => l.location_code.toLowerCase().includes(q))
      );
    });
  }, [inventory, search]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((r) => getTotalQty(r) <= LOW_STOCK_THRESHOLD).length;
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Inventory Management</h1>
          <p className="mt-2 text-slate-500">Monitor and manage warehouse stock levels</p>
        </div>
      </div>

      {/* LOW STOCK BANNER */}
      {lowStockCount > 0 && (
        <div className="rounded-2xl bg-orange-50 border border-orange-200 px-5 py-4 text-orange-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Low Stock Alert:</span>{" "}
            {lowStockCount} item{lowStockCount === 1 ? "" : "s"} are running low on stock and
            require restocking.
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
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed">
            <thead>
              <tr className="text-left text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-semibold w-36">SKU</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold w-28">Quantity</th>

                {/* now only shows count */}
                <th className="px-6 py-4 font-semibold w-40">Locations</th>

                <th className="px-6 py-4 font-semibold w-32">Status</th>
                <th className="px-6 py-4 font-semibold text-right w-28">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => {
                const totalQty = getTotalQty(r);
                const locCount = getLocations(r).length;

                return (
                  <tr key={r.inventory_id} className="hover:bg-slate-50">
                    <td className="px-6 py-5 font-mono text-slate-700 whitespace-nowrap">{r.sku}</td>

                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900 leading-tight">{r.product_name}</div>
                      <div className="mt-1 text-sm text-slate-400 line-clamp-2">
                        {r.product_description || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{totalQty}</span>
                        {totalQty <= LOW_STOCK_THRESHOLD && (
                          <span className="text-orange-600 text-xs font-semibold">↓</span>
                        )}
                      </div>
                    </td>

                    {/* Just the count (no click) */}
                    <td className="px-6 py-5 text-slate-700 whitespace-nowrap">
                      <span className="font-medium">
                        {locCount} location{locCount === 1 ? "" : "s"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge qty={totalQty} />
                    </td>

                    {/* Actions: Eye (view details) + PackagePlus (edit) */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* View details */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDetailsRow(r);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer hover:text-blue-600"
                          title="View inventory details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedRow(r);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer hover:text-green-600"
                          title="Edit inventory"
                        >
                          <PackagePlus className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
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
          <span className="hidden sm:block">Low stock threshold: {LOW_STOCK_THRESHOLD}</span>
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditInventoryModal
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
        onSaved={(updated) => {
          setInventory((prev) =>
            prev.map((x) => (x.inventory_id === updated.inventory_id ? updated : x))
          );

          // keep details modal in sync if it is open for same row
          setDetailsRow((prev) => (prev?.inventory_id === updated.inventory_id ? updated : prev));
        }}
      />

      {/* DETAILS MODAL */}
      <InventoryDetailsModal row={detailsRow} onClose={() => setDetailsRow(null)} />
    </div>
  );
}
