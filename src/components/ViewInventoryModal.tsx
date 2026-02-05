import { X, MapPin, Package, Hash } from "lucide-react";
import type { InventoryRow } from "../pages/ViewInventory";

/**
 * TODO (Backend):
 * - If you later return more fields in GET /api/inventory (weight, dimensions, flags),
 *   show them in this modal too.
 */

export default function ViewInventoryModal({
  row,
  onClose,
}: {
  row: InventoryRow | null;
  onClose: () => void;
}) {
  if (!row) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-500" />
              Inventory Details
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Quick view of stock + product info
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

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          {/* Top summary card */}
          <div className="rounded-2xl border border-slate-200 p-5">
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
                <div className="text-sm text-slate-500">Quantity</div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {row.quantity}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400" />
                Location: <span className="font-medium">{row.location_code}</span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700">
                Inventory ID: <span className="font-mono font-medium">{row.inventory_id}</span>
              </span>
            </div>
          </div>

          {/* Extra details (ready for backend expansion) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-700">Product ID</div>
              <div className="mt-1 text-sm text-slate-600 font-mono">{row.product_id}</div>
              {/* TODO (Backend): add a "Go to product" link if routes exist */}
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-700">Location ID</div>
              <div className="mt-1 text-sm text-slate-600 font-mono">{row.location_id}</div>
            </div>

            {/* TODO (Backend): If you return these in the inventory endpoint, add them here:
                - weight_kg
                - dimensions (length/width/height)
                - fragile/liquid/upright flags
                - max_stack_layers / pick_frequency
            */}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-slate-100 flex justify-end">
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
