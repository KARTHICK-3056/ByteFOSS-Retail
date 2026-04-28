import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const location = useLocation();
  const showSidebar = !location.pathname.startsWith('/profile');

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
