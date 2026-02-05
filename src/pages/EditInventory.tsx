import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Save, MapPin, Hash } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { InventoryRow } from "./ViewInventory";

/**
 * No backend yet:
 * - We receive an inventory row through router state from ViewInventory
 *
 * TODO (Backend):
 * - Fetch inventory row by id (if user refreshes / opens directly):
 *     GET /api/inventory/:id
 *     Response should include JOINED product + location fields:
 *     inventory_id, product_id, location_id, quantity,
 *     sku, product_name, product_description, location_code
 *
 * - Save changes:
 *     PUT/PATCH /api/inventory/:id
 *     Body example:
 *       { quantity: number, location_id?: number } OR { quantity: number, location_code?: string }
 *
 * - Validation server-side:
 *   - quantity >= 0
 *   - location exists
 *   - optional: prevent moving stock to invalid/blocked locations
 *
 * - later:
 *   - GET /api/locations  -> show dropdown instead of free text
 *   - Keep location_id as the real field, and only display location_code in UI
 */

type InventoryForm = {
  quantity: string; // keep string for input handling
  location_code: string;
};

function normalizeIntInput(v: string) {
  // allow empty while typing
  if (v.trim() === "") return "";
  // remove decimals + non-digits
  const cleaned = v.replace(/[^\d]/g, "");
  // avoid leading zeros weirdness
  const num = Number(cleaned);
  if (Number.isNaN(num)) return v;
  return String(Math.max(0, num));
}

export default function EditInventory() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // We pass inventory row via router state from ViewInventory
  const rowFromState = (location.state as { row?: InventoryRow } | null)?.row;

  const inventoryId = params.inventoryId;

  // If user refreshes / opens directly, we don't have state
  // TODO (Backend): fetch by id instead of showing fallback message
  if (!rowFromState) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Inventory</h1>
        <p className="mt-2 text-slate-500">No inventory data available for editing.</p>
        <p className="mt-2 text-sm text-slate-400">
          Inventory ID: <span className="font-mono">{inventoryId}</span>
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/inventory")}
            className="rounded-xl px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Back to Inventory
          </button>

          {/* TODO (Backend): fetch inventory by id here */}
        </div>
      </div>
    );
  }

  const [form, setForm] = useState<InventoryForm>({
    quantity: String(rowFromState.quantity ?? ""),
    location_code: rowFromState.location_code ?? "",
  });

  const qtyNumber = useMemo(() => Number(form.quantity || 0), [form.quantity]);
  const isLowStock = qtyNumber <= 20;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "quantity") {
      setForm((prev) => ({ ...prev, quantity: normalizeIntInput(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      inventory_id: rowFromState.inventory_id,
      // backend uses quantity + location_id
      // but for now we send location_code too (until locations endpoint exists)
      quantity: Number(form.quantity || 0),
      location_code: form.location_code.trim(),
    };

    try {
      // TODO (Backend): PUT/PATCH to python backend
      // await fetch(`http://localhost:8000/inventory/${rowFromState.inventory_id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      console.log("EDIT INVENTORY payload:", payload);
      alert("Saved (logged to console). Backend hook is TODO.");

      navigate("/inventory");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top title row (back + title) */}
      <div className="flex items-start gap-4">
        <Link
          to="/inventory"
          className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          title="Back to inventory"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Inventory</h1>
          <p className="mt-1 text-slate-500">Update stock quantity and location</p>
        </div>
      </div>

      {/* Quick context card (so user immediately sees product info) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-slate-900">
              {rowFromState.product_name}
            </div>
            <div className="mt-1 text-sm text-slate-500 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="font-mono">{rowFromState.sku}</span>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              {rowFromState.product_description || "—"}
            </div>
          </div>

          <div className="text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-slate-500">Inventory ID</div>
              <div className="font-mono font-medium text-slate-900">
                {rowFromState.inventory_id}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Inventory Information</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Quantity + status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  placeholder="e.g., 45"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {isLowStock && (
                  <div className="mt-2 text-sm text-orange-700">
                    ⚠ Low stock (≤ 20). Consider restocking.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Status
                </label>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${
                      isLowStock
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : "bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    {isLowStock ? "Low Stock" : "In Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Location Code <span className="text-red-500">*</span>
              </label>

              <div className="mt-2 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="location_code"
                  value={form.location_code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., A-12-03"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <p className="mt-2 text-sm text-red-500">
                {/* TODO (Backend): replace with dropdown when locations endpoint exists */}
                Later: make this a dropdown from <span className="font-mono">GET /api/locations</span>.
              </p>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="rounded-xl px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
