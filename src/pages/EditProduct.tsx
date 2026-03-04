import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  popularity_score?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ProductForm = {
  name: string;
  sku: string;
  category: string;
  description: string;

  length_cm: string;
  width_cm: string;
  height_cm: string;
  weight_kg: string;

  manufacturer: string;
  supplier: string;

  is_fragile: boolean;
  is_liquid: boolean;
  requires_upright: boolean;
};

const CATEGORY_OPTIONS = ["Electronics", "Industrial", "Furniture", "Chemicals", "Packaging"];

function normalizeNumberInput(v: string) {
  // Support EU decimal format (comma) and prevent negative values.
  if (v.trim() === "") return "";
  const normalized = v.replace(",", ".");
  const num = Number(normalized);
  if (Number.isNaN(num)) return v;
  return String(Math.max(0, num));
}

export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Try to get product from router state first
  const productFromState = (location.state as { product?: Product } | null)?.product;
  const productId = params.productId;

  // Fetch product on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      // Optimization: use product from router state if available (from ViewProduct page link).
      // This avoids unnecessary API call for a product already loaded.
      if (productFromState) {
        setProduct(productFromState);
        setIsLoading(false);
        return;
      }

      // Fallback: if navigating directly via URL, fetch product from API.
      if (!productId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/v1/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, productFromState]);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    sku: "",
    category: "Electronics",
    description: "",
    length_cm: "",
    width_cm: "",
    height_cm: "",
    weight_kg: "",
    manufacturer: "",
    supplier: "",
    is_fragile: false,
    is_liquid: false,
    requires_upright: false,
  });

  // Sync loaded product data into form for editing.
  useEffect(() => {
    if (!product) return;

    // Convert numeric product fields to strings for text input typing.
    setForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      category: "Electronics",
      description: product.description ?? "",
      length_cm: String(product.length_cm ?? ""),
      width_cm: String(product.width_cm ?? ""),
      height_cm: String(product.height_cm ?? ""),
      weight_kg: String(product.weight_kg ?? ""),
      manufacturer: "",
      supplier: "",
      is_fragile: !!product.is_fragile,
      is_liquid: !!product.is_liquid,
      requires_upright: !!product.requires_upright,
    });
  }, [product]);

  const dimensionsPreview = useMemo(() => {
    const l = form.length_cm || "—";
    const w = form.width_cm || "—";
    const h = form.height_cm || "—";
    return `${l} × ${w} × ${h} cm`;
  }, [form.length_cm, form.width_cm, form.height_cm]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: normalizeNumberInput(value) }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!product) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description.trim() || null,

        length_cm: Number(form.length_cm || 0),
        width_cm: Number(form.width_cm || 0),
        height_cm: Number(form.height_cm || 0),
        weight_kg: Number(form.weight_kg || 0),

        is_fragile: form.is_fragile,
        is_liquid: form.is_liquid,
        requires_upright: form.requires_upright,

        max_stack_layers: product.max_stack_layers ?? 10,
        pick_frequency: product.pick_frequency ?? 0,
        popularity_score: product.popularity_score ?? 0,
      };

      const res = await fetch(`${API_BASE_URL}/v1/products/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
        <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4">
          <p className="font-semibold text-red-900">Product not found</p>
          <div className="mt-3">
            <button
              onClick={() => navigate("/products")}
              className="rounded-lg bg-slate-600 px-4 py-2 text-white text-sm hover:bg-slate-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top title row (back + title) */}
      <div className="flex items-start gap-4">
        <Link
          to="/products"
          className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          title="Back to products"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
          <p className="mt-1 text-slate-500">Update product details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Product Information</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Row: name + sku */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  placeholder="e.g., PRD-001"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Row: category + weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  name="weight_kg"
                  value={form.weight_kg}
                  onChange={handleNumberChange}
                  required
                  inputMode="decimal"
                  placeholder="e.g., 2.5"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <div className="flex items-end justify-between gap-4">
                <label className="block text-sm font-medium text-slate-700">
                  Dimensions (L × W × H) <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400">{dimensionsPreview}</span>
              </div>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  name="length_cm"
                  value={form.length_cm}
                  onChange={handleNumberChange}
                  required
                  inputMode="decimal"
                  placeholder="Length (cm)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="width_cm"
                  value={form.width_cm}
                  onChange={handleNumberChange}
                  required
                  inputMode="decimal"
                  placeholder="Width (cm)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="height_cm"
                  value={form.height_cm}
                  onChange={handleNumberChange}
                  required
                  inputMode="decimal"
                  placeholder="Height (cm)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Manufacturer + Supplier (optional UI fields) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Manufacturer</label>
                <input
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  placeholder="Enter manufacturer name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Supplier</label>
                <input
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Handling Flags */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-slate-900">Handling Flags</h3>
              <p className="mt-1 text-sm text-slate-500">
                Mark special handling requirements for storage and picking.
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_fragile"
                    checked={form.is_fragile}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Fragile Item</div>
                    <div className="text-sm text-slate-500">
                      Requires special handling and care
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_liquid"
                    checked={form.is_liquid}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Liquid / Hazardous</div>
                    <div className="text-sm text-slate-500">
                      Contains regulated materials (update label later if needed)
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="requires_upright"
                    checked={form.requires_upright}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Requires Upright</div>
                    <div className="text-sm text-slate-500">
                      Must be stored/transported upright
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-xl px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Save className="h-5 w-5" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
