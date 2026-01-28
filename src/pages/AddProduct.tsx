import { useState, type ChangeEvent, type FormEvent } from 'react';

// 1. Define the shape of your product data
interface ProductData {
  name: string;
  sku: string;
  description?: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg: number;
  is_fragile: boolean;
  is_liquid: boolean;
  requires_upright: boolean;
  max_stack_layers: number;
  created_at: string;
}

interface PalletItemsData {
    pallet_item_id: number;
    pallet_id: number;
    layer_id: number;
    product_id: number;
    quantity: number;
}

const AddProduct = () => {
  // 2. Setup state to hold the form data
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    sku: '',
    description: '',
    length_cm: 0,
    width_cm: 0,
    height_cm: 0,
    weight_kg: 0,
    is_fragile: false,
    is_liquid: false,
    requires_upright: false,
    max_stack_layers: 0,
    created_at: new Date().toISOString(),
  });

  const [palletItemsData, setPalletItemsData] = useState<PalletItemsData>({
    pallet_item_id: 0,
    pallet_id: 0,
    layer_id: 0,
    product_id: 0,
    quantity: 0,
  });

// --- HANDLER 1: For Product Fields ---
  const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' ? Number(value) : value,
    }));
  };

  // --- HANDLER 2: For Inventory Fields (Quantity, etc) ---
  const handlePalletItemsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPalletItemsData((prev) => ({
      ...prev,
      [name]: Number(value), // Assuming these are mostly numbers
    }));
  };

  // 4. Handle form submission (Just logs to console for now API integration later)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Stop page refresh
    console.log('Product to add to Database:', productData);
    console.log('Pallet Item Data:', palletItemsData);
    alert('Product logged to console! (Check F12)');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 my-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📦 Create Product & Add Stock</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* === SECTION 1: PRODUCT DETAILS === */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-blue-100 pb-2">1. Product Definition</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input type="text" name="name" required
                value={productData.name} onChange={handleProductChange}
                className="w-full p-2 border rounded-md" placeholder="e.g. Ceramic Tiles" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">SKU</label>
              <input type="text" name="sku" required
                value={productData.sku} onChange={handleProductChange}
                className="w-full p-2 border rounded-md font-mono" placeholder="TILE-001" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-500">Length (cm)</label>
              <input type="number" name="length_cm" 
                value={productData.length_cm} onChange={handleProductChange}
                className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Width (cm)</label>
              <input type="number" name="width_cm" 
                value={productData.width_cm} onChange={handleProductChange}
                className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Height (cm)</label>
              <input type="number" name="height_cm" 
                value={productData.height_cm} onChange={handleProductChange}
                className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Weight (kg)</label>
              <input type="number" name="weight_kg" 
                value={productData.weight_kg} onChange={handleProductChange}
                className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>

        {/* === SECTION 2: INVENTORY DETAILS === */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider border-b border-green-200 pb-2">2. Initial Stock Level</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Initial Quantity</label>
              <input 
                type="number" 
                name="quantity" // This matches 'quantity' in PalletItemsData
                value={palletItemsData.quantity} 
                onChange={handlePalletItemsChange} // Uses the SECOND handler
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Target Pallet ID (Optional)</label>
              <input 
                type="text" 
                disabled 
                placeholder="Auto-assigned" 
                className="w-full p-2 border border-slate-200 bg-slate-100 text-slate-400 rounded-md cursor-not-allowed" 
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition">
          Save Product & Add Stock
        </button>

      </form>
    </div>
  );
};

export default AddProduct;