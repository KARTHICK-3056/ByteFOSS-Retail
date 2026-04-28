import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Customers = () => {
  const { customers, addCustomer, deleteCustomer } = useGlobalContext();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ f: '', l: '', e: '', p: '', address: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredCustomers = customers.filter(c => 
    `${c.f} ${c.l}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.e.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = (createAnother = false) => {
    if (!formData.f) return;
    addCustomer(formData);
    setFormData({ f: '', l: '', e: '', p: '', address: '' });
    if (!createAnother) setShowModal(false);
  };

  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filteredCustomers.map(c => c.id) : []);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} customers?`)) {
      selectedIds.forEach(id => deleteCustomer(id));
      setSelectedIds([]);
    }
  };

  return (
    <div className="w-full">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
        <span>Customers</span>
        <span className="text-gray-300">›</span>
        <span>List</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={deleteSelected} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-[13px] font-semibold transition-colors shadow-sm">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={() => setShowModal(true)} className="bg-amber-400 hover:bg-amber-500 text-gray-900 dark:text-white px-4 py-2 rounded text-[13px] font-semibold transition-colors shadow-sm">
             New customer
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
                  <input type="checkbox" checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} onChange={toggleSelectAll} className="rounded text-amber-500 border-gray-300 dark:border-[#3f3f46]" />
                </th>
                <th className="p-3 font-semibold text-[13px]">First name</th>
                <th className="p-3 font-semibold text-[13px]">Last name</th>
                <th className="p-3 font-semibold text-[13px]">Email</th>
                <th className="p-3 font-semibold text-[13px]">Phone</th>
                <th className="p-3 font-semibold text-[13px]">Orders</th>
                <th className="p-3 font-semibold text-[13px]">Points</th>
                <th className="p-3 font-semibold text-[13px]">Created at</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 dark:border-[#262626] dark:hover:bg-[#1f1f23] dark:bg-[#27272a] transition-colors text-gray-800 dark:text-gray-100">
                  <td className="p-3">
                     <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded text-amber-500 border-gray-300 dark:border-[#3f3f46]" />
                  </td>
                  <td className="p-3 text-[13px]">{c.f}</td>
                  <td className="p-3 text-[13px]">{c.l}</td>
                  <td className="p-3 text-[13px] text-gray-600 dark:text-gray-400">{c.e}</td>
                  <td className="p-3 text-[13px] text-gray-600 dark:text-gray-400">{c.p}</td>
                  <td className="p-3 text-[13px] font-medium">{c.o}</td>
                  <td className="p-3 text-[13px] font-bold text-amber-600">{c.points || 0}</td>
                  <td className="p-3 text-[13px] text-gray-600 dark:text-gray-400">{c.date?.slice(0, 10)}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => deleteCustomer(c.id)} className="text-red-500 font-semibold text-[13px] hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                   <td colSpan="9" className="p-6 text-center text-gray-500 dark:text-gray-400">No customers found.</td>
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 p-1">✕</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">First name <span className="text-red-500">*</span></label>
                    <input type="text" name="f" value={formData.f} onChange={handleInputChange} className="w-full px-3 py-2 border-2 border-amber-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input type="email" name="e" value={formData.e} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                    <textarea rows="4" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"></textarea>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Last name</label>
                    <input type="text" name="l" value={formData.l} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <input type="tel" name="p" value={formData.p} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-[#262626] bg-white dark:bg-[#18181b] flex gap-3">
              <button onClick={() => handleCreate(false)} className="bg-amber-400 hover:bg-amber-500 text-gray-900 dark:text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold">
                Create
              </button>
              <button onClick={() => handleCreate(true)} className="bg-white dark:bg-[#18181b] border text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg text-[13px] font-semibold">
                Create & create another
              </button>
              <button onClick={() => setShowModal(false)} className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] text-gray-600 dark:text-gray-400 px-5 py-2.5 rounded-lg text-[13px] font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
