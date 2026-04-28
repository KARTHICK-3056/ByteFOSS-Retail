import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] w-full max-w-[420px] p-8 md:p-10 border border-gray-100 dark:border-[#262626]">
        <div className="text-center mb-8 flex flex-col items-center">
          <img id="logo-light" src="/logo.png" alt="ByteFOSS Logo" className="w-12 h-12 object-contain mb-4 dark:hidden" />
          <img id="logo-dark" src="/logo-dark.png" alt="ByteFOSS Logo" className="w-12 h-12 object-contain mb-4 hidden dark:block" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">ByteFOSS Retail</h1>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sign in</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email address <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              type="email"
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#18181b] border-2 border-amber-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-sans text-gray-900 dark:text-white"
              defaultValue="admin@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password <span className="text-red-500 font-normal">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all pr-10 text-gray-900 dark:text-white"
                defaultValue="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors p-1"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center pt-1">
            <div className="flex items-center justify-center border border-gray-200 dark:border-[#262626] rounded divide-x divide-gray-200 overflow-hidden shrink-0">
               <input
                 id="remember-me"
                 type="checkbox"
                 className="h-4 w-4 rounded border-gray-300 dark:border-[#3f3f46] text-amber-500 focus:ring-amber-500 relative disabled:opacity-50"
                 style={{ accentColor: '#f59e0b' }}
               />
            </div>
            <label htmlFor="remember-me" className="ml-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-900 dark:text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-amber-500/30"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
