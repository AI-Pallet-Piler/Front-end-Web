import { useEffect, useMemo } from "react";
import { X, Hash, MapPin, Package } from "lucide-react";
import type { InventoryRow, InventoryLocation } from "../pages/ViewInventory";

const LOW_STOCK_THRESHOLD = 20;

function getLocations(r: InventoryRow): InventoryLocation[] {
  if (r.locations?.length) return r.locations;
  return r.location_code
    ? [{ location_code: r.location_code, quantity: r.quantity ?? 0 }]
    : [];
}

export default function InventoryDetailsModal({
  row,
  onClose,
}: {
  row: InventoryRow | null;
  onClose: () => void;
}) {
  // ESC to close + lock background scroll
  useEffect(() => {
    if (!row) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [row, onClose]);

  const locations = useMemo(() => (row ? getLocations(row) : []), [row]);

  const totalQty = useMemo(() => {
    return locations.reduce((sum, l) => sum + (l.quantity ?? 0), 0);
  }, [locations]);

  const isLow = totalQty <= LOW_STOCK_THRESHOLD;

  if (!row) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div>
            <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-500" />
              Inventory Details
            </div>
            <div className="mt-1 text-sm text-slate-500">
              All locations and quantities for this product
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Product context */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">
                  {row.product_name}
                </div>

                <div className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono">{row.sku}</span>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  {row.product_description || "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-500">Total Quantity</div>
                <div className="mt-1 inline-flex items-center gap-2">
                  <span className="text-base font-semibold text-slate-900">{totalQty}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${
                      isLow
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : "bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    {isLow ? "Low Stock" : "In Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Locations list */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">
                Locations ({locations.length})
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {locations.length === 0 ? (
                <div className="px-5 py-10 text-slate-400">No locations found.</div>
              ) : (
                locations.map((l, idx) => (
                  <div key={`${l.location_code}-${idx}`} className="px-5 py-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="font-mono font-medium">{l.location_code}</span>
                    </div>

                    <div className="text-slate-900 font-semibold">{l.quantity}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
