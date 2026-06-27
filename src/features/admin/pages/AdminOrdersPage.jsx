import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Package,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAdminOrders } from '../../../hooks/useAdmin';
import { formatDate, getDateValue } from '../../../utils/date';

const statusFilters = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' }
];

const statusStyles = {
  pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  shipped: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400'
};

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminOrders({
    status: activeFilter === 'all' ? undefined : activeFilter,
    search: searchQuery || undefined,
    page,
    limit: 10
  });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const totalOrders = data?.totalItems || data?.total || 0;

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  const updateSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('search', value.trim());
    else nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-1">Orders Management</h1>
          <p className="text-sm text-text-muted">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-text-primary hover:border-primary/50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => { setActiveFilter(filter.id); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-surface border border-border text-text-muted hover:border-primary/50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={searchQuery}
            onChange={(e) => updateSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-text-primary hover:border-primary/50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-text-primary hover:border-primary/50 transition-all shadow-sm">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium whitespace-nowrap">All Time</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-muted">Fetching orders...</p>
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary">Failed to load orders</h3>
            <p className="text-text-muted">There was an error connecting to the server.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary">No orders found</h3>
            <p className="text-text-muted">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Order</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Items</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Customer</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr
                      key={order.uuid}
                      className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/admin/orders/${order.uuid}`)}
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">#{order.order_number}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden">
                            <Package className="w-5 h-5 text-text-muted" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">Multiple Items</p>
                            <p className="text-[10px] text-text-muted uppercase">Qty: 1+</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-bold text-text-primary">{order.customer_name}</p>
                          <p className="text-[10px] text-text-muted">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-text-primary">₦{parseFloat(order.total).toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-muted whitespace-nowrap">
                        {formatDate(getDateValue(order))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/10">
              <p className="text-xs text-text-muted">
                Showing <span className="font-bold text-text-primary">{(page - 1) * 10 + 1}-{Math.min(page * 10, totalOrders)}</span> of <span className="font-bold text-text-primary">{totalOrders}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-30 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-text-primary" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === i + 1 ? 'bg-primary text-white' : 'hover:bg-surface text-text-muted'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-30 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-text-primary" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
