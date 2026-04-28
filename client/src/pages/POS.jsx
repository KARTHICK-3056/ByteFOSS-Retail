import { useState, useMemo } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const POS = () => {
  const { products, customers, orders, settings, addOrder, addCustomer } = useGlobalContext();
  
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerFormData, setCustomerFormData] = useState({ f: '', l: '', e: '', p: '', address: '' });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
         if (existing.qty >= product.stock) return prev; // limit max buyable to stock
         return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { 
         id: product.id, 
         name: product.name, 
         price: product.price, 
         tax: product.tax || 0, 
         qty: 1, 
         stock: product.stock 
      }];
    });
  };

  const updateQty = (id, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) return;
    setCartItems(prev => prev.map(item => {
       if (item.id === id) {
          return { ...item, qty: Math.min(qty, item.stock) };
       }
       return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const { subtotal, totalTax, grandTotal } = useMemo(() => {
    let sub = 0;
    let tax = 0;
    cartItems.forEach(item => {
      sub += item.price * item.qty;
      tax += (item.price * item.qty * item.tax) / 100;
    });
    return { subtotal: sub, totalTax: tax, grandTotal: sub + tax };
  }, [cartItems]);

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert('Cart is empty!');
    if (!selectedCustomerId) {
       setShowCustomerModal(true);
       return;
    }
    
    const customer = customers.find(c => c.id.toString() === selectedCustomerId);
    
    addOrder({
      customerId: customer.id,
      customerName: `${customer.f} ${customer.l}`,
      items: cartItems,
      subtotal,
      tax: totalTax,
      total: grandTotal
    });
    
    setCartItems([]);
    alert(`Order saved successfully! Customer earned ${Math.floor(grandTotal / 100)} points.`);
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerCreate = () => {
    if (!customerFormData.f) return;
    const newId = Date.now();
    addCustomer({ ...customerFormData, id: newId });
    setSelectedCustomerId(newId.toString());
    setShowCustomerModal(false);
    setCustomerFormData({ f: '', l: '', e: '', p: '', address: '' });
  };

  const recommendations = useMemo(() => {
    if (cartItems.length === 0) return [];
    const cartIds = cartItems.map(c => c.id);
    let freqMap = {};
    
    orders.forEach(o => {
        if (!o.items) return;
        const orderItemIds = o.items.map(i => i.id);
        const hasCartItem = cartIds.some(id => orderItemIds.includes(id));
        if (hasCartItem) {
            orderItemIds.forEach(id => {
                if (!cartIds.includes(id)) {
                    freqMap[id] = (freqMap[id] || 0) + 1;
                }
            });
        }
    });

    return Object.entries(freqMap)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => products.find(p => p.id === parseInt(id) && p.stock > 0))
        .filter(Boolean);
  }, [cartItems, orders, products]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
      {/* Left Panel - Cart */}
      <div className="w-full lg:w-[55%] flex flex-col gap-4">
        <div className="flex gap-2">
          <select 
            value={selectedCustomerId} 
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full bg-gray-600 dark:bg-[#27272a] text-white placeholder-gray-400 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-sm"
          >
            <option value="">Select Customer...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.f} {c.l} ({c.points || 0} pts)</option>)}
          </select>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] rounded-lg overflow-hidden text-sm flex-1 flex flex-col shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#27272a] text-gray-700 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-[#262626]">
                <th className="p-2.5 border-r border-gray-200 dark:border-[#262626] w-[45%]">Item</th>
                <th className="p-2.5 border-r border-gray-200 dark:border-[#262626] text-center w-[15%]">Rate</th>
                <th className="p-2.5 border-r border-gray-200 dark:border-[#262626] text-center w-[15%]">Tax(%)</th>
                <th className="p-2.5 border-r border-gray-200 dark:border-[#262626] text-center w-[15%]">Quantity</th>
                <th className="p-2.5 text-center w-[10%]">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? cartItems.map(item => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-[#262626] text-gray-800 dark:text-gray-100 bg-white dark:bg-[#18181b] dark:hover:bg-[#1f1f23] dark:bg-[#27272a] transition-colors">
                  <td className="p-2.5 border-r border-gray-200 dark:border-[#262626]">{item.name}</td>
                  <td className="p-2.5 border-r border-gray-200 dark:border-[#262626] text-center">{item.price.toFixed(2)}</td>
                  <td className="p-2.5 border-r border-gray-200 dark:border-[#262626] text-center">{item.tax.toFixed(2)}</td>
                  <td className="p-2.5 border-r border-gray-200 dark:border-[#262626] flex items-center justify-center gap-1.5">
                    <input type="number" min="1" max={item.stock} value={item.qty} onChange={(e) => updateQty(item.id, e.target.value)} className="w-12 text-center border border-gray-300 dark:border-[#3f3f46] rounded py-1 text-[13px] bg-white dark:bg-[#18181b] outline-none" />
                    <button onClick={() => removeFromCart(item.id)} className="bg-red-500 hover:bg-red-600 transition-colors text-white px-2 py-1 rounded text-xs font-bold leading-none disabled:opacity-50 flex items-center justify-center min-w-[24px]">✕</button>
                  </td>
                  <td className="p-2.5 text-right font-medium">{(((item.price * item.qty) * (1 + item.tax/100))).toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">Add Items.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mt-auto border-t border-gray-200 dark:border-[#262626] text-[13px] font-bold bg-white dark:bg-[#18181b] text-gray-900 dark:text-white">
             <div className="flex justify-between p-2.5 border-b border-gray-200 dark:border-[#262626]">
               <span className="text-right flex-1 pr-4">Subtotal</span>
               <span className="w-28 text-right">{settings.currency} {subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between p-2.5 border-b border-gray-200 dark:border-[#262626]">
               <span className="text-right flex-1 pr-4 whitespace-nowrap">Tax Amount</span>
               <span className="w-28 text-right">{settings.currency} {totalTax.toFixed(2)}</span>
             </div>
             <div className="flex justify-between p-2.5 font-extrabold pb-3 pt-3 bg-gray-50 dark:bg-[#27272a]">
               <span className="text-right flex-1 pr-4">Grand Total</span>
               <span className="w-28 text-right">{settings.currency} {grandTotal.toFixed(2)}</span>
             </div>
          </div>
        </div>

        <div>
           <button onClick={handleCheckout} className="bg-[#1cc065] hover:bg-[#19ab5a] text-white px-6 py-2.5 rounded-lg shadow-sm text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all">
            Save
          </button>
        </div>
      </div>

      {/* Right Panel - Products & Suggestions */}
      <div className="w-full lg:w-[45%] flex flex-col gap-4">
        {recommendations.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-lg p-3">
            <h3 className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">💡 Frequently Bought Together</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {recommendations.map(p => (
                <div onClick={() => addToCart(p)} key={p.id} className="bg-white dark:bg-[#18181b] border border-amber-200 rounded p-1.5 text-center shadow-sm cursor-pointer hover:border-amber-400 transition-colors flex items-center justify-between">
                   <div className="text-[11px] text-left text-gray-700 dark:text-gray-300 truncate capitalize flex-1">{p.name}</div>
                   <div className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded ml-1">+{settings.currency} {p.price.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <input 
          type="text" 
          placeholder="Search product..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-600 dark:bg-[#27272a] text-white placeholder-gray-400 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-sm" 
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pb-4 custom-scrollbar">
          {filteredProducts.map(p => {
             const outOfStock = p.stock <= 0;
             return (
              <div onClick={() => addToCart(p)} key={p.id} className={`relative bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] rounded-lg p-2 text-center transition-colors shadow-sm h-full flex flex-col ${outOfStock ? 'opacity-70 cursor-not-allowed' : 'hover:border-amber-500 cursor-pointer'}`}>
                {outOfStock && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg z-10 m-0">Out of Stock</div>
                )}
                {p.imageUrl ? (
                  <div className="h-20 flex items-center justify-center mb-2 overflow-hidden relative rounded-[4px]">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-20 bg-[#d4d4d4] flex items-center justify-center mb-2 overflow-hidden relative rounded-[4px]">
                     <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="text-[12px] text-left text-gray-700 dark:text-gray-300 truncate capitalize">{p.name} ({p.stock})</div>
                <div className="text-[12px] text-left text-gray-500 dark:text-gray-400 mt-auto pt-0.5">{settings.currency} {p.price.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-[#262626]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Customer</h2>
              <button onClick={() => setShowCustomerModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 p-1">✕</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">First name <span className="text-red-500">*</span></label>
                    <input type="text" name="f" value={customerFormData.f} onChange={handleCustomerInputChange} className="w-full px-3 py-2 border-2 border-amber-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input type="email" name="e" value={customerFormData.e} onChange={handleCustomerInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                    <textarea rows="4" name="address" value={customerFormData.address} onChange={handleCustomerInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"></textarea>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Last name</label>
                    <input type="text" name="l" value={customerFormData.l} onChange={handleCustomerInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <input type="tel" name="p" value={customerFormData.p} onChange={handleCustomerInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-[#262626] bg-white dark:bg-[#18181b] flex gap-3">
              <button onClick={handleCustomerCreate} className="bg-[#1cc065] hover:bg-[#19ab5a] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors">
                Create & Select
              </button>
              <button onClick={() => setShowCustomerModal(false)} className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] text-gray-600 dark:text-gray-400 px-5 py-2.5 rounded-lg text-[13px] font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
