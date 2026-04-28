import { useGlobalContext } from '../context/GlobalContext';
import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { orders, customers, products, settings, auditLogs } = useGlobalContext();

  const totalOrders = orders.length;
  const totalIncome = orders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = customers.length;

  const stats = [
    {
      title: 'Orders Count',
      value: totalOrders.toString(),
      trend: 'Total orders in the last 30 days',
      trendPositive: true,
    },
    {
      title: 'Income',
      value: `${settings.currency}${totalIncome.toFixed(2)}`,
      trend: 'Total income in the last 30 days',
      trendPositive: true,
    },
    {
      title: 'Customers Count',
      value: totalCustomers.toString(),
      trend: 'Last 30 days customers count',
      trendPositive: true,
    },
  ];

  const categorySales = useMemo(() => {
    let sales = {};
    orders.forEach(o => {
        if (!o.items) return;
        o.items.forEach(i => {
           const p = products.find(prod => prod.id === i.id);
           const cat = p && p.category ? p.category : 'General';
           sales[cat] = (sales[cat] || 0) + (i.price * i.qty);
        });
    });
    return sales;
  }, [orders, products]);

  const chartData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(categorySales),
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  const depletionWarnings = useMemo(() => {
    let salesCount = {};
    orders.forEach(o => {
        if (!o.items) return;
        o.items.forEach(i => {
            salesCount[i.id] = (salesCount[i.id] || 0) + i.qty;
        });
    });
    return products
      .filter(p => p.stock < 50)
      .map(p => ({ ...p, totalSold: salesCount[p.id] || 0 }))
      .sort((a,b) => b.totalSold - a.totalSold)
      .slice(0, 10);
  }, [products, orders]);

  const crmLeaderboard = useMemo(() => {
    return [...customers].sort((a,b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
  }, [customers]);

  return (
    <div className="w-full pb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-100 dark:border-[#262626] p-6 relative overflow-hidden flex flex-col gap-1"
          >
            <div className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </div>
            <div className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight mt-1 mb-3">
              {stat.value}
            </div>
            <div className={`text-sm font-medium flex items-center ${stat.trendPositive ? 'text-[#10b981]' : 'text-red-500'}`}>
              <svg className="w-4 h-4 mr-1.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {stat.trend}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none" style={{
                background: `linear-gradient(to top, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0) 100%)`,
                borderBottom: '3px solid #10b981',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                transform: 'translateY(5px) scaleX(1.05) rotate(-2deg)',
                transformOrigin: 'bottom left'
            }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         <div className="lg:col-span-2 bg-white dark:bg-[#18181b] rounded-xl shadow-sm border border-gray-100 dark:border-[#262626] p-6 flex flex-col min-h-[350px]">
             <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-wide">Sales by Product Category</h2>
             <div className="flex-1 relative w-full pb-4">
                 <Bar data={chartData} options={chartOptions} />
             </div>
         </div>
         <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-sm border border-gray-100 dark:border-[#262626] p-6 flex flex-col h-[350px]">
             <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-wide flex items-center gap-2">
                 <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 Security Audit Log
             </h2>
             <div className="overflow-y-auto flex-1 custom-scrollbar pr-2">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-[#27272a]/80 sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded-l">Time</th>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Product</th>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Old</th>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded-r">New</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(auditLogs || []).map((log, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 text-[12px] font-medium">
                        <td className="p-2 text-gray-400 whitespace-nowrap">{log.time.split(' ')[1]}</td>
                        <td className="p-2 text-gray-700 dark:text-gray-300 truncate max-w-[80px]">{log.productName}</td>
                        <td className="p-2 text-red-500">{log.oldStock}</td>
                        <td className="p-2 text-green-500">{log.newStock}</td>
                      </tr>
                    ))}
                    {(!auditLogs || auditLogs.length === 0) && (
                      <tr><td colSpan="4" className="p-4 text-center text-gray-400 text-xs">No audit logs.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-sm border border-gray-100 dark:border-[#262626] p-6 flex flex-col h-[350px]">
             <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-wide flex items-center gap-2">
                 <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 Depletion Warnings
             </h2>
             <div className="overflow-y-auto flex-1 custom-scrollbar pr-2 space-y-3">
                 {depletionWarnings.map((item, i) => (
                    <div key={i} className="bg-amber-50 dark:bg-amber-900/20/50 border-l-[3px] border-amber-400 p-3 rounded-r-lg flex justify-between items-center transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/30 dark:bg-amber-900/20">
                        <div>
                            <h3 className="font-bold text-[13px] text-gray-800 dark:text-gray-100">{item.name}</h3>
                            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5 tracking-wide">Stock: <span className="text-red-500">{item.stock}</span></p>
                        </div>
                        <span className="bg-white dark:bg-[#18181b] text-amber-600 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm border border-amber-100 whitespace-nowrap">
                            {item.totalSold} sold
                        </span>
                    </div>
                 ))}
                 {depletionWarnings.length === 0 && (
                     <div className="text-center p-4 text-sm text-gray-400 font-medium mt-4">All stocks are healthy (\u003E 50).</div>
                 )}
             </div>
         </div>

         <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-sm border border-gray-100 dark:border-[#262626] p-6 flex flex-col h-[350px]">
             <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-wide flex items-center gap-2">
                 <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                 CRM Leaderboard
             </h2>
             <div className="overflow-y-auto flex-1 custom-scrollbar pr-2">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-[#27272a]/80 sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 rounded-l">Customer</th>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Phone</th>
                      <th className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right rounded-r">Loyalty Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmLeaderboard.map((cust, i) => (
                      <tr key={cust.id} className="border-b border-gray-50 last:border-0 text-[13px]">
                        <td className="p-2 font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            {i < 3 ? <span className="text-[14px] leading-none">{['🥇', '🥈', '🥉'][i]}</span> : <span className="w-4 inline-block text-center text-gray-400 font-normal">{i+1}.</span>}
                            {cust.f} {cust.l}
                        </td>
                        <td className="p-2 text-gray-500 dark:text-gray-400 font-medium">{cust.p}</td>
                        <td className="p-2 text-amber-600 font-extrabold text-right">{cust.points || 0} pts</td>
                      </tr>
                    ))}
                    {crmLeaderboard.length === 0 && (
                      <tr><td colSpan="3" className="p-4 text-center text-gray-400 text-xs">No loyalty data yet.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
