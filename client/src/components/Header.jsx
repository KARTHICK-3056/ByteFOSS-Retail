import { LogOut, Monitor, Moon, Sun, User, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const Header = () => {
  const { adminProfile } = useGlobalContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('pos_theme') || 'system');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t) => {
      root.classList.remove('light', 'dark');
      if (t === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isSystemDark ? 'dark' : 'light');
        root.style.backgroundColor = isSystemDark ? '#0a0a0a' : '#fafafa';
      } else {
        root.classList.add(t);
        root.style.backgroundColor = t === 'dark' ? '#0a0a0a' : '#fafafa';
      }
    };

    applyTheme(theme);
    localStorage.setItem('pos_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
        root.style.backgroundColor = e.matches ? '#0a0a0a' : '#fafafa';
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="h-[64px] bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-[#262626] flex items-center justify-between px-4 lg:px-7 z-40 relative flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            <img id="logo-light" src="/logo.png" alt="ByteFOSS Logo" className="w-8 h-8 object-contain dark:hidden" />
            <img id="logo-dark" src="/logo-dark.png" alt="ByteFOSS Logo" className="w-8 h-8 object-contain hidden dark:block" />
            <h1 className="font-bold text-lg dark:text-white tracking-tight">ByteFOSS <span className="text-amber-500">Retail</span></h1>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-gray-900 border border-black/10 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-transparent transition-all focus:ring-amber-500 focus:outline-none"
          >
            {(() => {
               const name = adminProfile?.name || 'Admin User';
               const parts = name.split(' ').filter(Boolean);
               if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
               return name.substring(0, 2).toUpperCase();
            })()}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#18181b] rounded-xl shadow-lg shadow-black/5 py-1 border border-gray-200 dark:border-[#262626] z-50 animate-in fade-in zoom-in-95 duration-100">
              <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2.5 border-b border-gray-100 dark:border-[#262626] flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#27272a]/50 dark:bg-[#18181b]/50 rounded-t-xl hover:bg-gray-100 dark:bg-[#27272a] dark:hover:bg-[#27272a] transition-colors w-full">
                <User size={15} />
                <span className="font-medium">Profile</span>
              </Link>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#262626]">
                <div className="relative group">
                  <button onClick={() => setTheme('light')} className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'text-amber-500 bg-amber-50 dark:bg-[#27272a] dark:text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:bg-amber-900/20 dark:hover:bg-[#27272a]'}`}>
                    <Sun size={17} />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1.5 bg-[#27272a] text-[11px] font-medium text-white rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    Enable light mode
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#27272a] rotate-45"></div>
                  </div>
                </div>
                
                <div className="relative group">
                  <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-amber-500 bg-amber-50 dark:bg-[#27272a] dark:text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:bg-amber-900/20 dark:hover:bg-[#27272a]'}`}>
                    <Moon size={17} />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1.5 bg-[#27272a] text-[11px] font-medium text-white rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    Enable dark mode
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#27272a] rotate-45"></div>
                  </div>
                </div>

                <div className="relative group">
                  <button onClick={() => setTheme('system')} className={`p-1.5 rounded-md transition-colors ${theme === 'system' ? 'text-amber-500 bg-amber-50 dark:bg-[#27272a] dark:text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:bg-amber-900/20 dark:hover:bg-[#27272a]'}`}>
                    <Monitor size={17} />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1.5 bg-[#27272a] text-[11px] font-medium text-white rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    Enable system theme
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#27272a] rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-[#27272a] dark:hover:bg-[#27272a] dark:hover:text-white rounded-md flex items-center space-x-2 transition-colors">
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
