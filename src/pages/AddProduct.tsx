import { useState, type FormEvent } from 'react';

// 1. Define the shape of your product data
interface ProductData {
  name: string;
  sku: string;
  quantity: number;
  category: string;
}

const AddProduct = () => {
  // 2. Setup state to hold the form data
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    sku: '',
    quantity: 0,
    category: 'General',
  });

  // 3. Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert quantity to a number if the input is the quantity field
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  // 4. Handle form submission (Just logs to console for now)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Stop page refresh
    console.log('Product to add to Database:', formData);
    alert('Product logged to console! (Check F12)');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📦 Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wooden Pallet X1"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* SKU (Stock Keeping Unit) */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">SKU / ID</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. WP-2026-001"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Quantity & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="General">General</option>
              <option value="Fragile">Fragile</option>
              <option value="Perishable">Perishable</option>
              <option value="Hazardous">Hazardous</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-4"
        >
          Add to Database
        </button>

      </form>
    </div>
  );
};

export default AddProduct;