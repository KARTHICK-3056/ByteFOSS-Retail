import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

const Profile = () => {
  const { adminProfile, updateProfile } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: adminProfile?.name || 'Admin User',
    email: adminProfile?.email || 'admin@example.com',
    password: adminProfile?.password || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="w-full h-full min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] rounded-xl shadow-sm w-full max-w-[420px] p-8">
        <h2 className="text-[20px] font-bold text-gray-900 dark:text-white text-center mb-6 tracking-wide">Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-0 focus:border-[#f5841f] transition-colors bg-white dark:bg-[#18181b] text-gray-900 dark:text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-0 focus:border-[#f5841f] transition-colors bg-white dark:bg-[#18181b] text-gray-900 dark:text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-0 focus:border-[#f5841f] transition-colors bg-white dark:bg-[#18181b] text-gray-900 dark:text-white pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-[#f5841f] hover:bg-[#e07518] text-white text-[13px] font-semibold rounded shadow-sm transition-colors focus:outline-none"
            >
              Save changes
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] text-gray-700 dark:text-gray-300 text-[13px] font-semibold rounded dark:hover:bg-[#1f1f23] dark:bg-[#27272a] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
