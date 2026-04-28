import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, MonitorSmartphone, ShoppingCart, LayoutGrid, Users, Settings, ChevronLeft } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Point Of Sale', path: '/pos', icon: MonitorSmartphone },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Products', path: '/products', icon: LayoutGrid },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#fafafa] dark:bg-[#0a0a0a] hidden md:flex flex-col">
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-[#fff5e6] text-amber-600 dark:bg-[#18181b] dark:text-amber-500' // Better contrast active state to fit pitch black
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-[#27272a]/60 dark:hover:bg-[#111111]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
