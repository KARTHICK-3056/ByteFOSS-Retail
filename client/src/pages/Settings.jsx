import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Settings = () => {
  const { settings, updateSettings } = useGlobalContext();
  const [formData, setFormData] = useState(settings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings(formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      <div className="space-y-6 max-w-4xl">
        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">
            Site Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea 
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm shadow-sm resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">
            Currency symbol
          </label>
          <input 
            type="text" 
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 dark:text-white border border-amber-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm shadow-sm"
          />
        </div>

        <div className="pt-2">
          <button onClick={handleSave} className="bg-amber-400 hover:bg-amber-500 text-gray-900 dark:text-white px-6 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
             Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
