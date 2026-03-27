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
};

function Badge({
  children,
  variant,
}: {
  children: string;
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
  // Shared display format used across product modals/cards.
  return `${p.length_cm} × ${p.width_cm} × ${p.height_cm} cm`;
}

export default function DeleteProductModal({
  product,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  warning,
}: {
  product: Product | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warning?: ReactNode;
}) {
  // Render nothing when closed or if no product is selected.
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Delete Product</div>
            <div className="text-sm text-slate-500">This action cannot be undone.</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            disabled={isDeleting}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-900">{product.name}</div>
                <div className="text-sm text-slate-500 font-mono">{product.sku}</div>
              </div>
              <div className="text-sm text-slate-600 text-right">
                <div>{product.weight_kg} kg</div>
                <div>{formatDimensions(product)}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.is_fragile && <Badge variant="fragile">Fragile</Badge>}
              {product.is_liquid && <Badge variant="liquid">Liquid</Badge>}
              {product.requires_upright && <Badge variant="upright">Upright</Badge>}
              {!product.is_fragile && !product.is_liquid && !product.requires_upright && (
                <span className="text-sm text-slate-500">No special handling</span>
              )}
            </div>

            {product.description && (
              <div className="mt-3 text-sm text-slate-600">{product.description}</div>
            )}
          </div>

          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            Deleting this product will permanently remove the product definition.
            {warning ? <div className="mt-2">{warning}</div> : null}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
