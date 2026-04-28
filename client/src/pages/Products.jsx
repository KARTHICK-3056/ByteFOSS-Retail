import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Products = () => {
  const { products, addProduct, deleteProduct, restockProduct, settings } = useGlobalContext();
  const [showModal, setShowModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockData, setRestockData] = useState({ id: null, qty: 1, name: '' });
  
  const [formData, setFormData] = useState({ name: '', price: '', qty: 1, tax: 0, active: true, category: 'General', imageUrl: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const categories = ['General', 'Electronics', 'Snacks', 'Stationery', 'Beverages'];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
          setFormData(prev => ({ ...prev, imageUrl: reader.result }));
       };
       reader.readAsDataURL(file);
    }
  };

  const handleCreate = (createAnother = false) => {
    if (!formData.name || !formData.price || !formData.qty) return;
    addProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.qty, 10),
      tax: parseFloat(formData.tax),
      active: formData.active,
      category: formData.category,
      imageUrl: formData.imageUrl
    });
    setFormData({ name: '', price: '', qty: 1, tax: 0, active: true, category: 'General', imageUrl: '' });
    if (!createAnother) setShowModal(false);
  };

  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filteredProducts.map(p => p.id) : []);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} products?`)) {
      selectedIds.forEach(id => deleteProduct(id));
      setSelectedIds([]);
    }
  };

  const handleOpenRestock = (product) => {
    setRestockData({ id: product.id, qty: 1, name: product.name });
    setShowRestockModal(true);
  }

  const handleRestock = () => {
    if (restockData.qty > 0) {
       restockProduct(restockData.id, parseInt(restockData.qty, 10));
    }
    setShowRestockModal(false);
  }

  return (
    <div className="w-full">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
        <span>Products</span>
        <span className="text-gray-300">›</span>
        <span>List</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={deleteSelected} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-[13px] font-semibold transition-colors shadow-sm">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={() => setShowModal(true)} className="bg-[#1cc065] hover:bg-[#19ab5a] text-white px-4 py-2 rounded text-[13px] font-semibold transition-colors shadow-sm">
             New product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] rounded-xl overflow-hidden text-sm shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
        <div className="p-3 border-b border-gray-100 dark:border-[#262626] flex justify-between items-center bg-white dark:bg-[#18181b]">
           <div className="flex-1" />
           <div className="relative flex items-center">
             <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-4 pr-4 py-1.5 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-gray-50 dark:bg-[#27272a] text-[13px] w-[250px]" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] dark:bg-[#1f1f23] text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#262626]">
              <tr>
                <th className="p-3 font-semibold text-[13px] w-12">
                   <input type="checkbox" checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0} onChange={toggleSelectAll} className="rounded text-amber-500 border-gray-300 dark:border-[#3f3f46]" />
                </th>
                <th className="p-3 font-semibold text-[13px] w-16">Image</th>
                <th className="p-3 font-semibold text-[13px]">Name</th>
                <th className="p-3 font-semibold text-[13px]">Category</th>
                <th className="p-3 font-semibold text-[13px]">Quantity</th>
                <th className="p-3 font-semibold text-[13px]">Price ({settings.currency})</th>
                <th className="p-3 font-semibold text-[13px]">Created at</th>
                <th className="p-3 text-right font-semibold text-[13px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-[#262626] dark:hover:bg-[#1f1f23] dark:bg-[#27272a] transition-colors text-gray-800 dark:text-gray-100">
                  <td className="p-3">
                     <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded text-amber-500 border-gray-300 dark:border-[#3f3f46]" />
                  </td>
                  <td className="p-3">
                    {p.imageUrl ? 
                       <img src={p.imageUrl} className="w-8 h-8 rounded object-cover border border-gray-200 dark:border-[#262626]" alt={p.name} /> : 
                       <div className="w-8 h-8 bg-gray-200 dark:bg-[#3f3f46] rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">{p.name.charAt(0)}</div>}
                  </td>
                  <td className="p-3 text-[13px] font-medium">{p.name}</td>
                  <td className="p-3 text-[13px]"><span className="bg-gray-100 dark:bg-[#27272a] text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">{p.category || 'General'}</span></td>
                  <td className="p-3 text-[13px] font-medium">
                     <span className={`${p.stock < 10 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{p.stock}</span>
                  </td>
                  <td className="p-3 text-[13px]">{settings.currency} {p.price.toFixed(2)}</td>
                  <td className="p-3 text-[13px] text-gray-500 dark:text-gray-400">{p.date?.slice(0, 10)}</td>
                  <td className="p-3 text-right whitespace-nowrap gap-3 flex justify-end items-center">
                    <button onClick={() => handleOpenRestock(p)} className="text-[#1cc065] font-semibold text-[13px] hover:underline">Restock</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 font-semibold text-[13px] hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                   <td colSpan="8" className="p-6 text-center text-gray-500 dark:text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-[#262626]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Product</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 p-1">✕</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Price <span className="text-red-500">*</span></label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:border-amber-500 outline-none bg-white dark:bg-[#18181b]">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 pt-2 cursor-pointer w-max">
                    <div className="relative flex items-center">
                      <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} className="sr-only" />
                      <div className={`w-[42px] h-[24px] rounded-full transition-colors shadow-inner ${formData.active ? 'bg-[#ee8424]' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-[3px] bg-white dark:bg-[#18181b] w-[18px] h-[18px] rounded-full transition-transform shadow-sm border border-gray-100 dark:border-[#262626] ${formData.active ? 'translate-x-[18px]' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-[14px] font-bold text-gray-800 dark:text-gray-100">Active</span>
                  </label>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tax (%)</label>
                    <input type="number" name="tax" value={formData.tax} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Initial Quantity <span className="text-red-500">*</span></label>
                    <input type="number" name="qty" value={formData.qty} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-800 dark:text-gray-100 mb-2">Image</label>
                    <div className="relative">
                      <label className="flex flex-col items-center justify-center w-full h-[80px] border-[1.5px] border-gray-300 dark:border-[#3f3f46] rounded-xl cursor-pointer dark:hover:bg-[#1f1f23] dark:bg-[#27272a] transition-colors">
                        <span className="text-[14px] text-gray-600 dark:text-gray-400 font-medium">
                          Drag & Drop your files or <span className="text-[#f5841f] font-semibold">Browse</span>
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    {formData.imageUrl && <div className="mt-1.5 text-[11px] text-green-600 font-bold">Image uploaded!</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-[#262626] bg-gray-50 dark:bg-[#27272a]/50 flex gap-3">
              <button onClick={() => handleCreate(false)} className="bg-[#1cc065] hover:bg-[#19ab5a] text-white px-5 py-2 rounded-lg text-[13px] font-semibold">
                Create
              </button>
              <button onClick={() => handleCreate(true)} className="bg-white dark:bg-[#18181b] border text-gray-700 dark:text-gray-300 px-5 py-2 rounded-lg text-[13px] font-semibold">
                Create & create another
              </button>
              <button onClick={() => setShowModal(false)} className="bg-white dark:bg-[#18181b] border text-gray-700 dark:text-gray-300 px-5 py-2 rounded-lg text-[13px] font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
             <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-[#262626]">
               <h2 className="text-base font-bold text-gray-900 dark:text-white">Restock {restockData.name}</h2>
             </div>
             <div className="p-6">
                <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Amount to add</label>
                <input type="number" min="1" value={restockData.qty} onChange={(e) => setRestockData(p => ({...p, qty: e.target.value}))} className="w-full px-3 py-2 border border-green-500 rounded-lg focus:border-green-600 outline-none ring-2 ring-green-100" />
             </div>
             <div className="p-5 border-t border-gray-100 dark:border-[#262626] bg-gray-50 dark:bg-[#27272a]/50 flex gap-3">
               <button onClick={handleRestock} className="bg-[#1cc065] hover:bg-[#19ab5a] text-white px-5 py-2 rounded-lg text-[13px] font-semibold flex-1">
                 Add Stock
               </button>
               <button onClick={() => setShowRestockModal(false)} className="bg-white dark:bg-[#18181b] border text-gray-700 dark:text-gray-300 px-5 py-2 rounded-lg text-[13px] font-semibold flex-1">
                 Cancel
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Products;

