/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/pages/AdminAuditPage.jsx */
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Download,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  UserCheck,
  CalendarClock
} from 'lucide-react';

import { useAdminAuditLogs } from '../../../hooks/useAdmin';
import { getDateValue, toValidDate } from '../../../utils/date';

export default function AdminAuditPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminAuditLogs({
    page,
    limit: 15,
    action: searchQuery || undefined
  });

  const logs = data?.logs || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const summary = data?.summary || { todayCount: 0, activeAdmins: 0, breakdown: { creates: 0, updates: 0, deletes: 0, other: 0 } };

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

  const formatDate = (dateString) => {
    const d = toValidDate(dateString);
    if (!d) return { time: 'Not available', date: 'Not available' };

    return {
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
    if (action.includes('UPDATE')) return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    if (action.includes('DELETE') || action.includes('CANCEL')) return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400';
    return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400';
  };

  const getLogDetail = (log) => {
    const oldValues = log.old_values || {};
    const newValues = log.new_values || {};

    if (log.action === 'UPDATE_ORDER_STATUS') return `Changed status to ${newValues.status || 'updated'}`;
    if (log.action === 'CANCEL_ORDER') return `Cancelled order${newValues.reason ? `: ${newValues.reason}` : ''}`;
    if (log.action === 'RESTOCK_PRODUCT') return `Stock ${oldValues.stock_quantity ?? '-'} -> ${newValues.stock_quantity ?? '-'}`;
    if (log.action === 'CREATE_PRODUCT') return `Created ${newValues.name || 'product'}`;
    if (log.action === 'UPDATE_PRODUCT') return `Updated ${newValues.name || 'product details'}`;
    if (log.action === 'DELETE_PRODUCT') return 'Product deactivated';
    if (log.action === 'CREATE_COUPON') return `Created coupon ${newValues.code || ''}`.trim();
    if (log.action === 'UPDATE_COUPON') return `Updated coupon ${newValues.code || ''}`.trim();
    if (log.action === 'DELETE_COUPON') return `Deleted coupon ${oldValues.code || ''}`.trim();
    if (log.action === 'UPDATE_SHIPPING_SETTINGS') return 'Updated shipping defaults';
    if (log.action.includes('SHIPPING_ZONE')) return `${log.action.replace(/_/g, ' ').toLowerCase()}`;
    if (log.action.includes('PROMO')) return `${log.action.replace(/_/g, ' ').toLowerCase()}`;
    if (log.action === 'UPDATE_STORE_SETTINGS') return 'Updated store settings';
    if (log.action === 'CREATE_ADMIN_USER') return `Created admin ${newValues.email || ''}`.trim();
    if (log.action === 'CHANGE_ADMIN_PASSWORD') return 'Changed admin password';
    if (log.action === 'UPDATE_ADMIN_PROFILE') return 'Updated profile details';
    if (log.action === 'UPLOAD_ADMIN_AVATAR') return 'Uploaded profile image';
    return 'Administrative action recorded';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Audit & System Logs</h1>
          <p className="text-gray-500 dark:text-[#888888] mt-1">A dynamic record of admin changes to products, orders, inventory, settings, coupons, shipping, promos, and admin accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-[#2A2A2A] rounded-full text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2A2A2A] rounded-full text-sm focus:outline-none focus:border-[#FF6B8A]"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <p className="text-xs text-[#FF6B8A] uppercase tracking-wider font-medium">Registry Size</p>
          <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-2">{totalItems.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500">Total matching logs</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <p className="text-xs text-[#FF6B8A] uppercase tracking-wider font-medium">Today</p>
          <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-2">{summary.todayCount.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <CalendarClock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400 dark:text-[#888888]">Actions recorded today</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <p className="text-xs text-[#FF6B8A] uppercase tracking-wider font-medium">Active Admins</p>
          <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-2">{summary.activeAdmins.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <UserCheck className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400 dark:text-[#888888]">Admins with logs today</span>
          </div>
        </div>
      </div>

      {/* Recent Timeline */}
      <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Timeline</h2>
          <div className="flex items-center gap-2 text-xs text-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            LIVE UPDATE ACTIVE
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
             <div className="py-20 text-center text-red-500">Failed to load logs.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100 dark:border-[#2A2A2A]">
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Timestamp</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Admin</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Action</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Entity</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-sm text-gray-500 dark:text-[#888888]">
                      No audit logs match this search.
                    </td>
                  </tr>
                )}
                {logs.map((log) => {
                  const { time, date } = formatDate(getDateValue(log));
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors">
                      <td className="py-4">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{time}</p>
                        <p className="text-xs text-gray-500 dark:text-[#888888]">{date}</p>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{log.adminUser?.name || 'System'}</p>
                          <p className="text-xs text-gray-500 dark:text-[#888888]">{log.adminUser?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase ${getActionColor(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{log.entity_type}</p>
                        <p className="text-[10px] text-gray-500">ID: {log.entity_id}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-gray-600 dark:text-[#888888]">
                          {getLogDetail(log)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-[#2A2A2A]">
          <p className="text-sm text-gray-500 dark:text-[#888888]">
            Showing {totalItems === 0 ? 0 : (page - 1) * 15 + 1}-{Math.min(page * 15, totalItems)} of {totalItems.toLocaleString()} logs
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-1.5 bg-[#FF6B8A] text-white rounded-full text-sm font-medium">
              {page}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-4">Today&apos;s Action Mix</h2>
          <p className="text-gray-600 dark:text-[#888888] leading-relaxed">
            The audit log records admin-side changes. Customer actions like browsing, placing unpaid orders, or Paystack callbacks are handled elsewhere unless an admin changes the record.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white dark:bg-[#141414] p-4">
              <p className="text-gray-400 text-xs uppercase">Creates</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.breakdown.creates}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#141414] p-4">
              <p className="text-gray-400 text-xs uppercase">Updates</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.breakdown.updates}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#141414] p-4">
              <p className="text-gray-400 text-xs uppercase">Deletes / Cancels</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.breakdown.deletes}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#141414] p-4">
              <p className="text-gray-400 text-xs uppercase">Other</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.breakdown.other}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#141414] rounded-full shadow-sm mb-3">
              <Activity className="w-4 h-4 text-[#FF6B8A]" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">AUDIT COVERAGE</span>
            </div>
            <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Admin Changes</p>
            <p className="text-sm text-gray-500 dark:text-[#888888] mt-2">Products, orders, inventory, coupons, shipping, promos, settings, and admin profiles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
