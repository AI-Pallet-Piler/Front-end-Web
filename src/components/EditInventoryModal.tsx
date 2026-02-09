import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { X, MapPin, Hash, Package, Save, Minus, Plus, Trash2 } from "lucide-react";
import type { InventoryRow } from "../pages/ViewInventory";

/**
 * Multi-location inventory editor (scrollable modal)
 *
 * Recommended InventoryRow shape:
 *  {
 *    inventory_id: number;
 *    product_name: string;
 *    sku: string;
 *    product_description?: string;
 *    locations: { location_code: string; quantity: number }[];
 *  }
 *
 * Fallback supported:
 *  - quantity + location_code on root row -> converted into locations[0]
 */

type FormLocation = {
  location_code: string;
  quantity: string; // keep string for input typing
};

type InventoryForm = {
  locations: FormLocation[];
};

function normalizeIntInput(v: string) {
  if (v.trim() === "") return "";
  const cleaned = v.replace(/[^\d]/g, "");
  const num = Number(cleaned);
  if (Number.isNaN(num)) return v;
  return String(Math.max(0, num));
}

function clampNonNeg(n: number) {
  return Math.max(0, n);
}

export default function EditInventoryModal({
  row,
  onClose,
  onSaved,
}: {
  row: InventoryRow | null;
  onClose: () => void;
  onSaved: (updated: InventoryRow) => void;
}) {
  const [form, setForm] = useState<InventoryForm>({ locations: [] });

  // init/reset when modal opens
  useEffect(() => {
    if (!row) return;

    // fallback: if row.locations doesn't exist, convert single location_code/quantity into one location
    const anyRow = row as any;
    const locationsFromRow: Array<{ location_code: string; quantity: number }> =
      Array.isArray(anyRow.locations) && anyRow.locations.length > 0
        ? anyRow.locations
        : [
            {
              location_code: anyRow.location_code ?? "",
              quantity: Number(anyRow.quantity ?? 0),
            },
          ];

    setForm({
      locations: locationsFromRow.map((l) => ({
        location_code: String(l.location_code ?? ""),
        quantity: String(l.quantity ?? 0),
      })),
    });
  }, [row]);

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

  // Derived: total quantity across all locations
  const totalQty = useMemo(() => {
    return form.locations.reduce((sum, l) => sum + Number(l.quantity || 0), 0);
  }, [form.locations]);

  const isTotalLowStock = totalQty <= 20;

  // Validation: at least 1 location, each has code, quantity present; no duplicate codes
  const validation = useMemo(() => {
    if (form.locations.length === 0) {
      return { ok: false, message: "Add at least one location." };
    }

    for (const l of form.locations) {
      if (!l.location_code.trim()) return { ok: false, message: "Location code is required." };
      if (l.quantity.trim() === "") return { ok: false, message: "Quantity is required." };
    }

    const normalizedCodes = form.locations.map((l) => l.location_code.trim().toLowerCase());
    const unique = new Set(normalizedCodes);
    if (unique.size !== normalizedCodes.length) {
      return { ok: false, message: "Duplicate location codes are not allowed." };
    }

    return { ok: true, message: "" };
  }, [form.locations]);

  function updateLocation(index: number, patch: Partial<FormLocation>) {
    setForm((prev) => {
      const copy = [...prev.locations];
      copy[index] = { ...copy[index], ...patch };
      return { ...prev, locations: copy };
    });
  }

  function adjustLocationQty(index: number, delta: number) {
    setForm((prev) => {
      const copy = [...prev.locations];
      const current = Number(copy[index]?.quantity || 0);
      const next = clampNonNeg(current + delta);
      copy[index] = { ...copy[index], quantity: String(next) };
      return { ...prev, locations: copy };
    });
  }

  function addLocation() {
    setForm((prev) => ({
      ...prev,
      locations: [...prev.locations, { location_code: "", quantity: "0" }],
    }));
  }

  function removeLocation(index: number) {
    // (optional) block removing last location; uncomment if you want that rule
    // if (form.locations.length === 1) return;

    setForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!row || !validation.ok) return;

    const payload = {
      inventory_id: (row as any).inventory_id,
      locations: form.locations.map((l) => ({
        location_code: l.location_code.trim(),
        quantity: Number(l.quantity || 0),
      })),
    };

    try {
      // TODO (Backend):
      // await fetch(`http://localhost:8000/inventory/${row.inventory_id}/locations`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      console.log("EDIT INVENTORY MULTI-LOCATION payload:", payload);

      // optimistic update (keep compatibility with old table columns too)
      onSaved({
        ...(row as any),
        locations: payload.locations,
        quantity: payload.locations.reduce((s, l) => s + l.quantity, 0),
        location_code: payload.locations[0]?.location_code ?? "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  if (!row) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ✅ Scrollable modal panel */}
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* ✅ Sticky HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div>
            <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-500" />
              Edit Inventory (Multiple Locations)
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Add multiple locations and manage quantity per location
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

        {/* ✅ Scrollable BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick context */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">
                  {(row as any).product_name}
                </div>

                <div className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono">{(row as any).sku}</span>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  {(row as any).product_description || "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-500">Inventory ID</div>
                <div className="text-sm font-mono font-medium text-slate-900">
                  {(row as any).inventory_id}
                </div>

                <div className="mt-3">
                  <div className="text-sm text-slate-500">Total Quantity</div>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-900">{totalQty}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${
                        isTotalLowStock
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {isTotalLowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Locations list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">
                Locations <span className="text-red-500">*</span>
              </div>

              <button
                type="button"
                onClick={addLocation}
                className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                + Add location
              </button>
            </div>

            {form.locations.map((loc, index) => {
              const qty = Number(loc.quantity || 0);
              const isLocLow = qty <= 20;

              return (
                <div key={index} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-700">Location {index + 1}</div>

                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
                      title="Remove location"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  {/* Location code */}
                  <div className="mt-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Location Code <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2 relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        value={loc.location_code}
                        onChange={(e) => updateLocation(index, { location_code: e.target.value })}
                        required
                        placeholder="e.g., A-12-03"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Quantity stepper */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Quantity <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2 flex items-stretch gap-2">
                      <button
                        type="button"
                        onClick={() => adjustLocationQty(index, -1)}
                        className="rounded-xl border border-slate-200 px-3 hover:bg-slate-50"
                        aria-label="Decrease by 1"
                        title="-1"
                      >
                        <Minus className="h-5 w-5" />
                      </button>

                      <input
                        value={loc.quantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateLocation(index, { quantity: normalizeIntInput(e.target.value) })
                        }
                        required
                        inputMode="numeric"
                        placeholder="e.g., 45"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() => adjustLocationQty(index, 1)}
                        className="rounded-xl border border-slate-200 px-3 hover:bg-slate-50"
                        aria-label="Increase by 1"
                        title="+1"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => adjustLocationQty(index, -5)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustLocationQty(index, 5)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustLocationQty(index, -10)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustLocationQty(index, 10)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                      >
                        +10
                      </button>
                    </div>

                    {isLocLow && (
                      <div className="mt-2 text-sm text-orange-700">
                        ⚠ Low stock at this location (≤ 20).
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {form.locations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-600">
                No locations yet. Click <span className="font-medium">+ Add location</span>.
              </div>
            )}
          </div>

          {/* Validation message */}
          {!validation.ok && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validation.message}
            </div>
          )}
        </form>

        {/* ✅ Sticky FOOTER (outside the scrollable form) */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={(e) => {
              // trigger submit manually since footer is outside form flow
              const formEl = (e.currentTarget.closest("div")?.previousSibling as HTMLFormElement | null);
              formEl?.requestSubmit();
            }}
            disabled={!validation.ok}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
