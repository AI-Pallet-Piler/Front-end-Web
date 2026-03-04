import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Eye, PackagePlus, Search } from "lucide-react";
import EditInventoryModal from "../components/EditInventoryModal";
import InventoryDetailsModal from "../components/InventoryDetailsModal";
import { API_BASE_URL } from "../config/api";

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

  // Single location fields (legacy/fallback)
  quantity: number;
  location_code: string;

  // Multi-location support
  locations?: InventoryLocation[];
};

const LOW_STOCK_THRESHOLD = 20;

/**
 * Helpers to support both single-location (legacy) and multi-location inventory.
 * This allows gradual migration without breaking existing data.
 */
function getLocations(r: InventoryRow): InventoryLocation[] {
  // If multi-location data exists, use it.
  if (r.locations?.length) return r.locations;
  // Fallback to legacy single-location format.
  return r.location_code
    ? [{ location_code: r.location_code, quantity: r.quantity ?? 0 }]
    : [];
}

function getTotalQty(r: InventoryRow): number {
  // Sum quantities across all locations.
  return getLocations(r).reduce((sum, l) => sum + (l.quantity ?? 0), 0);
}

function StatusBadge({ qty }: { qty: number }) {
  // Visual indicator for low vs. normal stock levels.
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

export default function ViewInventory() {
  // Data state
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Edit modal state
  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);

  // Details modal state
  const [detailsRow, setDetailsRow] = useState<InventoryRow | null>(null);

  // Fetch all inventory on component mount.
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/inventory`);
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data = await res.json();
        setInventory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        alert("Failed to load inventory data");
        setInventory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Real-time search filter by product name, SKU, or location code.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inventory;

    // Search across product name, SKU, and all location codes for this inventory row.
    return inventory.filter((r) => {
      const locs = getLocations(r);
      return (
        r.product_name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        locs.some((l) => l.location_code.toLowerCase().includes(q))
      );
    });
  }, [inventory, search]);

  // Count items below low-stock threshold for alert banner.
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
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4">Loading inventory...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium">No inventory found</p>
              <p className="mt-1 text-sm">
                {search ? "Try adjusting your search" : "No inventory items available"}
              </p>
            </div>
          ) : (
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
            </tbody>
          </table>
          )}
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
