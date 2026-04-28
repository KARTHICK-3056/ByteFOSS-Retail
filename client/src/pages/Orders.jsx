import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Orders = () => {
  const { orders, deleteOrder, settings } = useGlobalContext();
  const [selectedIds, setSelectedIds] = useState([]);

  const totalOrders = orders.length;
  const totalIncome = orders.reduce((sum, order) => sum + order.total, 0);

  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? orders.map(o => o.id) : []);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} orders?`)) {
      selectedIds.forEach(id => deleteOrder(id));
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Customer', 'Items', 'Subtotal', 'Tax', 'Total', 'Date'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customerName}"`,
      `"${o.items ? o.items.map(i => i.name).join(', ') : ''}"`,
      o.subtotal,
      o.tax,
      o.total,
      `"${o.date}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
        <span>Orders</span>
        <span className="text-gray-300">›</span>
        <span>List</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={deleteSelected} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-[13px] font-semibold transition-colors shadow-sm">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={handleExport} className="bg-amber-400 hover:bg-amber-500 text-gray-900 dark:text-white px-4 py-2 rounded text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
             <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
             Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-[#262626] rounded-xl p-5 shadow-sm relative overflow-hidden">
           <div className="text-[13px] text-gray-500 dark:text-gray-400 mb-2 font-medium">Total orders</div>
           <div className="text-[28px] font-bold mb-3 tracking-tight text-gray-900 dark:text-white">{totalOrders}</div>
           <div className="text-[13px] text-[#1cc065] flex items-center gap-1.5 font-medium">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             Total orders
           </div>
           <div className="absolute bottom-0 left-0 right-0 h-1" style={{background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'}} />
        </div>
        <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-[#262626] rounded-xl p-5 shadow-sm relative overflow-hidden">
           <div className="text-[13px] text-gray-500 dark:text-gray-400 mb-2 font-medium">Income</div>
           <div className="text-[28px] font-bold mb-3 tracking-tight text-gray-900 dark:text-white">{settings.currency} {totalIncome.toFixed(2)}</div>
           <div className="text-[13px] text-[#1cc065] flex items-center gap-1.5 font-medium">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             Total income
           </div>
           <div className="absolute bottom-0 left-0 right-0 h-1" style={{background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'}} />
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] rounded-xl overflow-hidden text-sm shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] dark:bg-[#1f1f23] text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#262626]">
              <tr>
                <th className="p-3 font-semibold text-[13px] w-12">
                  <input type="checkbox" checked={selectedIds.length === orders.length && orders.length > 0} onChange={toggleSelectAll} className="rounded text-amber-500 focus:ring-amber-500 border-gray-300 dark:border-[#3f3f46]" />
                </th>
                <th className="p-3 font-semibold text-[13px]">ID</th>
                <th className="p-3 font-semibold text-[13px]">Customer Name</th>
                <th className="p-3 font-semibold text-[13px]">Total price</th>
                <th className="p-3 font-semibold text-[13px]">Created at</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-[#262626] dark:hover:bg-[#1f1f23] dark:bg-[#27272a] transition-colors text-gray-800 dark:text-gray-100">
                  <td className="p-3">
                     <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => toggleSelect(order.id)} className="rounded text-amber-500 focus:ring-amber-500 border-gray-300 dark:border-[#3f3f46]" />
                  </td>
                  <td className="p-3 text-[13px]">{order.id}</td>
                  <td className="p-3 text-[13px] capitalize">{order.customerName}</td>
                  <td className="p-3 text-[13px]">{settings.currency} {order.total.toFixed(2)}</td>
                  <td className="p-3 text-[13px] text-gray-600 dark:text-gray-400">{order.date}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => deleteOrder(order.id)} className="text-red-500 font-semibold text-[13px] hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                   <td colSpan="6" className="p-6 text-center text-gray-500 dark:text-gray-400">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
