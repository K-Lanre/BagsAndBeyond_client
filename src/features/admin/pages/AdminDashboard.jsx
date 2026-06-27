import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  useAdminStats,
  useAdminSalesChart,
  useAdminInventory,
  useAdminRecentOrders
} from '../../../hooks/useAdmin';
import { formatDate, getDateValue } from '../../../utils/date';

export default function AdminDashboard() {
  const [chartType, setChartType] = useState('area');
  const [period, setPeriod] = useState('daily');

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: salesData, isLoading: salesLoading } = useAdminSalesChart(period);
  const { data: inventory, isLoading: inventoryLoading } = useAdminInventory();
  const { data: ordersData, isLoading: ordersLoading } = useAdminRecentOrders(5);
  const lowStockItems = Array.isArray(inventory) ? inventory : inventory?.low_stock || [];
  const monthlyRevenue = Number(stats?.revenue?.month || 0);
  const totalOrders = Number(stats?.orders?.total || 0);
  const totalProducts = Number(stats?.totalProducts || 0);
  const lowStockCount = Number(stats?.lowStockCount || lowStockItems.length || 0);
  const chartTooltipStyle = {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    boxShadow: '0 16px 30px rgb(0 0 0 / 0.16)'
  };
  const chartTooltipLabelStyle = {
    color: 'var(--text-muted)',
    fontWeight: 600
  };
  const chartTooltipItemStyle = {
    color: 'var(--primary)',
    fontWeight: 700
  };

  const statsCards = [
    {
      id: 'revenue',
      label: 'Month Revenue',
      value: `₦${monthlyRevenue.toLocaleString()}`,
      change: 'Paid orders',
      isPositive: true,
      icon: TrendingUp
    },
    {
      id: 'sales',
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: 'All statuses',
      isPositive: true,
      icon: ShoppingBag
    },
    {
      id: 'conversion',
      label: 'Total Products',
      value: totalProducts.toLocaleString(),
      change: 'Active catalog',
      isPositive: true,
      icon: Package
    },
    {
      id: 'stock',
      label: 'Low Stock',
      value: lowStockCount.toLocaleString(),
      change: lowStockCount > 0 ? 'Action required' : 'Optimal',
      isPositive: lowStockCount === 0,
      icon: AlertCircle
    },
  ];

  if (statsLoading || salesLoading || inventoryLoading || ordersLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-text-muted animate-pulse">Loading dashboard intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-1">Dashboard Overview</h1>
          <p className="text-sm text-text-muted">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/50 transition-all shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Performance Chart */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-text-primary">Sales Performance</h2>
            <p className="text-sm text-text-muted">Revenue trend over {period}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${chartType === 'area' ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:text-text-primary'}`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${chartType === 'bar' ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:text-text-primary'}`}
            >
              Bar
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis dataKey="date" stroke="currentColor" className="text-text-muted" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" className="text-text-muted" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value >= 1000 ? (value / 1000) + 'k' : value}`} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  labelStyle={chartTooltipLabelStyle}
                  itemStyle={chartTooltipItemStyle}
                  cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            ) : (
              <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis dataKey="date" stroke="currentColor" className="text-text-muted" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" className="text-text-muted" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value >= 1000 ? (value / 1000) + 'k' : value}`} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  labelStyle={chartTooltipLabelStyle}
                  itemStyle={chartTooltipItemStyle}
                  cursor={{ fill: 'var(--secondary)', opacity: 0.25 }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders + Side Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-text-primary">Recent Orders</h2>
              <p className="text-sm text-text-muted">Latest customer activity</p>
            </div>
            <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Order</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Customer</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ordersData?.orders?.map((order) => (
                  <tr key={order.uuid} className="hover:bg-secondary/30 transition-colors group">
                    <td className="py-4 px-4 text-sm font-bold text-text-primary">#{order.order_number}</td>
                    <td className="py-4 px-4 text-sm text-text-muted">{order.customer_name}</td>
                    <td className="py-4 px-4 text-sm font-bold text-text-primary">₦{parseFloat(order.total).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-muted">{formatDate(getDateValue(order))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="space-y-6">
          {/* Stock Alerts */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-text-primary">Inventory Alerts</h2>
              <span className={`w-2 h-2 rounded-full ${lowStockItems.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
            <div className="space-y-3">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{item.name}</p>
                      <p className={`text-[10px] font-bold uppercase ${Number(item.stock_quantity) === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                        {item.stock_quantity} in stock
                      </p>
                    </div>
                    <Link to={`/admin/products/${item.slug}`} className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-lg hover:bg-primary/20 transition-all">
                      Restock
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-text-muted">All products well stocked</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Selling Categories (Mocked or from API if added) */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-bold text-text-primary mb-4">Best Sellers</h2>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Bags</span>
                  <div className="flex-1 mx-4 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '75%' }} />
                  </div>
                  <span className="text-xs font-bold text-text-primary">75%</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Shoes</span>
                  <div className="flex-1 mx-4 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '45%' }} />
                  </div>
                  <span className="text-xs font-bold text-text-primary">45%</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
