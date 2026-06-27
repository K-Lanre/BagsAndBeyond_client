/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/orders/pages/MyOrdersPage.jsx */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, Truck, CheckCircle, Clock, XCircle, Search, Mail } from 'lucide-react';
import { getOrders, getCustomerData } from '../../../utils/customerStorage';
import { getProductImageUrl } from '../../../utils/productImages';

// Default sample orders if no localStorage data
const defaultSampleOrders = [
  {
    id: 'BAB-00124',
    date: 'Oct 25, 2024',
    total: 48500,
    status: 'Processing',
    items: [
      { name: 'Elegance Tote', image: '/landing/2.jfif', quantity: 1, price: 45000 },
    ],
  },
  {
    id: 'BAB-00119',
    date: 'Oct 15, 2024',
    total: 42000,
    status: 'Shipped',
    items: [
      { name: 'Silk Stilettos', image: '/landing/3.jfif', quantity: 1, price: 42000 },
    ],
  },
  {
    id: 'BAB-00110',
    date: 'Sep 28, 2024',
    total: 78500,
    status: 'Delivered',
    items: [
      { name: 'Leather Briefcase', image: '/landing/4.jfif', quantity: 1, price: 78500 },
    ],
  },
  {
    id: 'BAB-00095',
    date: 'Aug 12, 2024',
    total: 35000,
    status: 'Delivered',
    items: [
      { name: 'Canvas Backpack', image: '/landing/1.jfif', quantity: 1, price: 35000 },
    ],
  },
  {
    id: 'BAB-00084',
    date: 'Jul 05, 2024',
    total: 65000,
    status: 'Cancelled',
    items: [
      { name: 'Weekender Bag', image: '/landing/2.jfif', quantity: 1, price: 65000 },
    ],
  },
];

const tabs = [
  { id: 'all', label: 'All', count: null },
  { id: 'pending', label: 'Pending', count: 1 },
  { id: 'processing', label: 'Processing', count: null },
  { id: 'shipped', label: 'Shipped', count: 1 },
  { id: 'delivered', label: 'Delivered', count: null },
  { id: 'cancelled', label: 'Cancelled', count: 1 },
];

const statusConfig = {
  Processing: {
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
    label: 'Processing',
  },
  Shipped: {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Truck,
    label: 'Shipped',
  },
  Delivered: {
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
    label: 'Delivered',
  },
  Cancelled: {
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
    label: 'Cancelled',
  },
  Pending: {
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    icon: Package,
    label: 'Pending',
  },
};

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = getOrders();
    const customerData = getCustomerData();

    if (storedOrders.length > 0) {
      setOrders(storedOrders);
    } else {
      // Use sample data for demo purposes
      setOrders(defaultSampleOrders);
    }

    if (customerData?.email) {
      setCustomerEmail(customerData.email);
    }
  }, []);

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status?.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-primary font-medium">My Orders</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-2">
            My Orders
          </h1>
          <p className="text-text-muted text-sm">
            {customerEmail ? `Showing orders for ${customerEmail}` : 'Manage and track your recent purchases'}
          </p>
          {isGuest && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Guest Checkout:</strong> Your orders are stored locally.
                <Link to="/track-order" className="underline ml-1">Track by email</Link> to find orders on other devices.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:text-primary border border-border'
                }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-1.5 text-[10px] bg-text-muted/20 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.Pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-14 h-14 bg-secondary/20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getProductImageUrl([order.items[0].image])}
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = '/landing/Bags Collection.png';
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                        Order ID
                      </p>
                      <p className="font-bold text-text-primary text-sm mb-1">#{order.id}</p>
                      <p className="text-xs text-text-muted">{order.date}</p>
                    </div>
                  </div>

                  {/* Status & Total */}
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right md:text-right">
                      <p className="text-xs text-text-muted mb-1">Total</p>
                      <p className="font-bold text-text-primary">₦{order.total.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>

                      <Link
                        to={`/orders/${order.id}`}
                        className="p-2 hover:bg-secondary/30 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-text-muted" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-text-muted mb-2">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="text-xs text-text-primary bg-secondary/20 px-2 py-1 rounded">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="font-serif font-bold text-text-primary mb-2">No orders found</h3>
            <p className="text-text-muted text-sm mb-6">
              {activeTab !== 'all' ? `You don't have any ${activeTab} orders.` : 'No orders yet. Start shopping!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors"
              >
                Start Shopping
              </Link>
              <Link
                to="/track-order"
                className="px-8 py-3 border border-border text-text-primary font-medium rounded-full hover:bg-surface transition-colors inline-flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Track Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
