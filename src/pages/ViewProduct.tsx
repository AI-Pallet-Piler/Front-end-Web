import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ViewProductModal from "../components/ViewProductModal";
import { API_BASE_URL } from "../config/api";

export type Product = {
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
  return `${p.length_cm} × ${p.width_cm} × ${p.height_cm} cm`;
}

export default function ViewProduct() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // View modal state
  const [selected, setSelected] = useState<Product | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;

    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/products/${deleteTarget.product_id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) throw new Error("Failed to delete product");

      // Optimistic UI update
      setProducts((prev) =>
        prev.filter((p) => p.product_id !== deleteTarget.product_id)
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Product Management</h1>
          <p className="mt-2 text-slate-500">
            Manage your warehouse products and specifications
          </p>
        </div>

        {/* Add product is still a separate page */}
        <Link
          to="/products/add"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* SEARCH */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-1 text-sm">
                {search ? "Try adjusting your search" : "Add your first product to get started"}
              </p>
            </div>
          ) : (
          <table className="w-full min-w-[980px] table-fixed">
            <thead>
              <tr className="text-left text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-semibold w-36">SKU</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold w-28">Weight</th>
                <th className="px-6 py-4 font-semibold w-52">Dimensions</th>
                <th className="px-6 py-4 font-semibold w-56">Flags</th>
                <th className="px-6 py-4 font-semibold text-right w-40">Actions</th>
    </tr>
  </thead>


            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.product_id} className="hover:bg-slate-50">
                  <td className="px-6 py-5 font-mono text-slate-700 whitespace-nowrap">{p.sku}</td>

                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-900 leading-tight">{p.name}</div>
                    <div className="mt-1 text-sm text-slate-400 line-clamp-2">{p.description || "—"}</div>
                  </td>

                  <td className="px-6 py-5 text-slate-700 whitespace-nowrap">{p.weight_kg} kg</td>
                  <td className="px-6 py-5 text-slate-700 whitespace-nowrap">{formatDimensions(p)}</td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {p.is_fragile && <Badge variant="fragile">Fragile</Badge>}
                      {p.is_liquid && <Badge variant="liquid">Liquid</Badge>}
                      {p.requires_upright && <Badge variant="upright">Upright</Badge>}
                      {!p.is_fragile && !p.is_liquid && !p.requires_upright && (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {/* VIEW PRODUCT DETAILS */}
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="p-2 rounded-lg text-slate-600inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 cursor-pointer hover:text-blue-600"
                        title="View product"
                      >
                        <Eye className="h-5 w-5" />
                      </button>

                      {/* DELETE PRODUCT (POPUP MODAL) */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 cursor-pointer hover:text-red-600"
                        title="Delete product"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

<Link
  to={`/products/${p.product_id}/edit`}
  state={{ product: p }} // pass product to edit page
  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer hover:text-green-600"
  title="Edit product"
>
  ✎
</Link>


                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          
        </div>
      </div>

      {/*  CLEAN VIEW MODAL (COMPONENT) */}
      <ViewProductModal product={selected} onClose={() => setSelected(null)} />

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">Delete Product</div>
                <div className="text-sm text-slate-500">This action cannot be undone.</div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
                disabled={isDeleting}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Product summary */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{deleteTarget.name}</div>
                    <div className="text-sm text-slate-500 font-mono">{deleteTarget.sku}</div>
                  </div>
                  <div className="text-sm text-slate-600 text-right">
                    <div>{deleteTarget.weight_kg} kg</div>
                    <div>{formatDimensions(deleteTarget)}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {deleteTarget.is_fragile && <Badge variant="fragile">Fragile</Badge>}
                  {deleteTarget.is_liquid && <Badge variant="liquid">Liquid</Badge>}
                  {deleteTarget.requires_upright && <Badge variant="upright">Upright</Badge>}
                  {!deleteTarget.is_fragile &&
                    !deleteTarget.is_liquid &&
                    !deleteTarget.requires_upright && (
                      <span className="text-sm text-slate-500">No special handling</span>
                    )}
                </div>

                {deleteTarget.description && (
                  <div className="mt-3 text-sm text-slate-600">{deleteTarget.description}</div>
                )}
              </div>

              {/* Warning */}
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                Deleting this product will permanently remove the product definition.
                {/* TODO (Backend): show warning if product is linked to inventory/orders */}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
