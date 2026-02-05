import type { ReactNode } from "react";

type Product = {
  product_id: number;
  sku: string;
  name: string;
  description?: string | null;

  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg: number;

  is_fragile: boolean;
  is_liquid: boolean;
  requires_upright: boolean;

  max_stack_layers?: number | null;
  pick_frequency?: number | null;

  created_at?: string | null;
  updated_at?: string | null;
};

function Badge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "fragile" | "liquid" | "upright";
}) {
  const styles =
    variant === "fragile"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : variant === "liquid"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {children}
    </span>
  );
}

function formatDimensions(p: Product) {
  return `${p.length_cm} × ${p.width_cm} × ${p.height_cm} cm`;
}

export default function ViewProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      {/* 
        max-h prevents clipping
        flex-col lets only the content scroll
      */}
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col">
        {/* HEADER (fixed) */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <div className="text-lg font-semibold text-slate-900">{product.name}</div>
            <div className="text-sm text-slate-500 font-mono">{product.sku}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* CONTENT (scrollable) */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Description */}
          <div>
            <div className="text-sm font-semibold text-slate-700">Description</div>
            <div className="mt-1 text-slate-600">{product.description || "—"}</div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-400">Dimensions</div>
              <div className="mt-1 font-medium text-slate-800">{formatDimensions(product)}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-400">Weight</div>
              <div className="mt-1 font-medium text-slate-800">{product.weight_kg} kg</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-400">Max stack layers</div>
              <div className="mt-1 font-medium text-slate-800">
                {product.max_stack_layers ?? "—"}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-400">Pick frequency</div>
              <div className="mt-1 font-medium text-slate-800">{product.pick_frequency ?? "—"}</div>
            </div>
          </div>

          {/* Handling flags */}
          <div>
            <div className="text-sm font-semibold text-slate-700">Handling flags</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.is_fragile && <Badge variant="fragile">Fragile</Badge>}
              {product.is_liquid && <Badge variant="liquid">Liquid</Badge>}
              {product.requires_upright && <Badge variant="upright">Upright</Badge>}

              {!product.is_fragile && !product.is_liquid && !product.requires_upright && (
                <span className="text-slate-500">No special handling</span>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="text-xs text-slate-400 flex flex-wrap gap-4">
            <span>Created: {product.created_at ?? "—"}</span>
            <span>Updated: {product.updated_at ?? "—"}</span>
          </div>

          {/* TODO (Backend): Show live inventory/stock info here */}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-slate-100 flex justify-end shrink-0">
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
