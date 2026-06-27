import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, ChevronRight, Mail, ShoppingBag, Loader2, AlertCircle, CreditCard, WifiOff } from 'lucide-react';
import { useTrackOrders } from '../../../hooks/useOrders';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { formatDate, getDateValue } from '../../../utils/date';

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
};

const statusColors = {
  pending: 'text-yellow-500 bg-yellow-50',
  processing: 'text-blue-500 bg-blue-50',
  shipped: 'text-purple-500 bg-purple-50',
  delivered: 'text-green-500 bg-green-50',
  cancelled: 'text-red-500 bg-red-50',
};

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [searchEmail, setSearchEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(Boolean(initialEmail));
  const isOnline = useOnlineStatus();

  const { data: orders, isLoading, isError, error } = useTrackOrders(searchEmail);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    if (!isOnline) return;
    setSearchEmail(emailInput);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-[#FF8E53] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Track Your Order
          </h1>
          <p className="text-white/80">
            Enter your email to view all your orders - no account needed
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Form */}
        <div className="bg-surface border border-border rounded-2xl p-8 mb-8 shadow-sm">
          {!isOnline && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>Order lookup needs internet. Reconnect and search again.</p>
            </div>
          )}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !isOnline}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/30"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find Orders
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-text-muted">Fetching your orders...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 font-medium">Error loading orders</p>
                <p className="text-red-500/70 text-sm">{error?.response?.data?.message || 'Something went wrong. Please try again.'}</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <>
                <h2 className="text-xl font-serif font-bold text-text-primary mb-4">
                  Found {orders.length} order{orders.length !== 1 ? 's' : ''}
                </h2>
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  return (
                    <div
                      key={order.uuid}
                      className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusColors[order.status] || 'text-gray-500 bg-gray-50'}`}>
                            <StatusIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">
                              Order #{order.order_number}
                            </p>
                            <p className="text-sm text-text-muted">
                              Placed on {formatDate(getDateValue(order), {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'text-gray-500 bg-gray-50'}`}>
                                {order.status}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.payment_status === 'paid'
                                  ? 'text-green-600 bg-green-50'
                                  : 'text-yellow-600 bg-yellow-50'
                              }`}>
                                <CreditCard className="w-3 h-3" />
                                {order.payment_status === 'paid' ? 'paid' : 'payment pending'}
                              </span>
                              <span className="text-xs text-text-muted">
                                {order.items_count || 0} items
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6">
                          <p className="font-bold text-text-primary text-lg">
                            ₦{parseFloat(order.total).toLocaleString()}
                          </p>
                          <Link
                            to={`/orders/${order.uuid}?email=${encodeURIComponent(searchEmail)}`}
                            className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all"
                          >
                            {order.payment_status === 'paid' ? 'Details' : 'Pay / Details'}
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-12 bg-surface border border-border rounded-2xl">
                <ShoppingBag className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-text-primary mb-2">
                  No orders found
                </h3>
                <p className="text-text-muted mb-4 text-sm">
                  We couldn't find any orders for <span className="text-text-primary font-medium">{searchEmail}</span>
                </p>
                <p className="text-xs text-text-muted/60">
                  Make sure to use the same email you used during checkout
                </p>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/contact"
              className="flex items-center gap-3 p-4 bg-white dark:bg-[#141414] rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-[#FF6B8A]/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#FF6B8A]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Contact Support</p>
                <p className="text-sm text-gray-500">Get help with your order</p>
              </div>
            </a>
            <a
              href="/faq"
              className="flex items-center gap-3 p-4 bg-white dark:bg-[#141414] rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-[#FF6B8A]/10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-[#FF6B8A]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">FAQ</p>
                <p className="text-sm text-gray-500">Find answers quickly</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
