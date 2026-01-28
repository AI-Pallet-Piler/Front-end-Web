import { useState } from 'react';

// --- YOUR INTERFACES ---
interface ProductData {
  id: number;
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


// --- 1. MOCK DATA (Matches your new interface) ---
const initialProducts: ProductData[] = [
  { 
    id: 1, name: 'Ceramic Vase', sku: 'DEC-001', description: 'Decorative vase',
    length_cm: 20, width_cm: 20, height_cm: 40, weight_kg: 2.5,
    is_fragile: true, is_liquid: false, requires_upright: true, max_stack_layers: 2, created_at: '2026-01-10'
  },
  { 
    id: 2, name: 'Industrial Lubricant', sku: 'LUB-50L', description: '50L Drum',
    length_cm: 40, width_cm: 40, height_cm: 60, weight_kg: 55,
    is_fragile: false, is_liquid: true, requires_upright: true, max_stack_layers: 1, created_at: '2026-01-12'
  },
  { 
    id: 3, name: 'Steel Bearings', sku: 'STL-BRG-X', description: 'Box of 1000',
    length_cm: 15, width_cm: 15, height_cm: 10, weight_kg: 8,
    is_fragile: false, is_liquid: false, requires_upright: false, max_stack_layers: 10, created_at: '2026-01-15'
  },
];

const DeleteProduct = () => {
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  // --- DELETE LOGIC ---
  const handleDelete = (idToDelete: number) => {
    const confirmDelete = window.confirm("Are you sure? This will remove the product definition permanently.");
    if (confirmDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== idToDelete));
    }
  };

  // --- SEARCH LOGIC ---
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 my-10">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🗑️ Inventory List</h2>
          <p className="text-slate-500 text-sm">Manage and remove product definitions.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search SKU or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none w-full md:w-72"
          />
          <span className="absolute right-3 top-2.5 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold border-b w-32">SKU</th>
              <th className="p-4 font-semibold border-b">Product Details</th>
              <th className="p-4 font-semibold border-b">Physical Specs</th>
              <th className="p-4 font-semibold border-b">Handling</th>
              <th className="p-4 font-semibold border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-red-50 transition-colors group">
                  
                  {/* SKU */}
                  <td className="p-4 font-mono text-slate-600 font-bold">{p.sku}</td>
                  
                  {/* Name & Desc */}
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.description || 'No description'}</div>
                  </td>

                  {/* Physical Specs */}
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span title="Dimensions">📏 {p.length_cm}x{p.width_cm}x{p.height_cm} cm</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span title="Weight">⚖️ {p.weight_kg} kg</span>
                    </div>
                  </td>

                  {/* Handling Flags (Badges) */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.is_fragile && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          FRAGILE
                        </span>
                      )}
                      {p.is_liquid && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          LIQUID
                        </span>
                      )}
                      {p.requires_upright && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          UPRIGHT
                        </span>
                      )}
                      {!p.is_fragile && !p.is_liquid && !p.requires_upright && (
                        <span className="text-xs text-slate-400">Standard</span>
                      )}
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-sm font-medium shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic">
                  No products found matching "{searchTerm}"
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteProduct;