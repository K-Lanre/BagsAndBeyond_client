import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Clock,
  Package,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAdminOrderDetail, useUpdateOrderStatus } from '../../../hooks/useAdmin';
import { useEffect, useRef, useState } from 'react';
import { getProductImageUrl } from '../../../utils/productImages';
import { formatDateTime, getDateValue } from '../../../utils/date';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500'
};

const statusTransitions = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

const parseShippingAddress = (address) => {
  if (!address) return {};
  if (typeof address === 'string') {
    try {
      return JSON.parse(address);
    } catch (error) {
      return { street: address };
    }
  }
  return address;
};

export default function AdminOrderDetailPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);

  const { data: order, isLoading, isError } = useAdminOrderDetail(uuid);
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (newStatus) => {
    setIsStatusMenuOpen(false);
    setIsUpdating(true);
    try {
      await updateStatusMutation.mutateAsync({ uuid, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-text-muted animate-pulse">Loading transaction records...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">Order Not Found</h2>
        <p className="text-text-muted mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  const shippingAddress = parseShippingAddress(order.shipping_address);
  const nextStatuses = statusTransitions[order.status] || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors border border-border bg-surface"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">Transaction Record</p>
            <h1 className="text-2xl font-serif font-bold text-text-primary">Order #{order.order_number}</h1>
            <p className="text-xs text-text-muted">Placed on {formatDateTime(getDateValue(order))}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <div ref={statusMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen((open) => !open)}
              disabled={isUpdating || nextStatuses.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl shadow-sm disabled:cursor-not-allowed disabled:opacity-75"
            >
              <span className={`w-2 h-2 rounded-full ${statusColors[order.status]} ${order.status === 'processing' ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-bold text-text-primary uppercase">{order.status}</span>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </button>
            
            {/* Status Dropdown */}
            {isStatusMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl py-2 z-50">
                <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border mb-1">
                  Next status
                </p>
                {nextStatuses.map((s) => (
                  <button
                    key={s}
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(s)}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase hover:bg-secondary transition-colors text-text-primary disabled:opacity-60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all">
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-bold text-text-primary mb-6">Order Items</h2>
            <div className="space-y-6">
              {(order.items || order.Items || []).map((item) => {
                const product = item.product || item.Product;
                const itemPrice = parseFloat(item.price_at_time || item.price || 0);

                return (
                <div key={item.id} className="flex gap-4 group">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-secondary/50 rounded-xl flex-shrink-0 overflow-hidden border border-border">
                    <img
                      src={product ? getProductImageUrl(product) : getProductImageUrl([item.product_image])}
                      alt={item.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/admin/products/${product?.slug || item.product_slug || ''}`} className="text-sm font-bold text-text-primary hover:text-primary transition-colors mb-1 block">
                          {item.product_name}
                        </Link>
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-2">SKU: {product?.sku || 'N/A'}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-text-muted rounded text-[10px] font-bold uppercase">
                            Qty: {item.quantity}
                          </span>
                          {item.variant && (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-text-muted rounded text-[10px] font-bold uppercase">
                                {item.variant}
                             </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-text-primary">₦{itemPrice.toLocaleString()}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase mt-1">Subtotal: ₦{(itemPrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <CreditCard className="w-32 h-32" />
             </div>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium">Subtotal</span>
                <span className="font-bold text-text-primary">₦{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium">Shipping</span>
                <span className="font-bold text-text-primary">₦{parseFloat(order.shipping_cost || 0).toLocaleString()}</span>
              </div>
              {parseFloat(order.discount_amount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-emerald-600 font-medium">Discount</span>
                    {order.coupon && (
                      <span className="text-[10px] text-emerald-500 font-bold uppercase">Code: {order.coupon.code}</span>
                    )}
                  </div>
                  <span className="font-bold text-emerald-600">-₦{parseFloat(order.discount_amount).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-4 border-t border-primary/10">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary font-serif font-bold text-lg">Total Amount</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₦{parseFloat(order.total).toLocaleString()}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                      {order.payment_status === 'paid' ? 'Payment Verified' : 'Payment Outstanding'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Customer Profile */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] text-primary font-bold uppercase tracking-widest mb-6 border-b border-border pb-2">Customer Profile</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold">
                {order.customer_name?.[0]}
              </div>
              <div>
                <p className="font-bold text-text-primary">{order.customer_name}</p>
                <p className="text-xs text-text-muted">Customer</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-secondary rounded-lg text-text-muted group-hover:text-primary transition-colors">
                   <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm text-text-muted truncate">{order.customer_email}</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-secondary rounded-lg text-text-muted group-hover:text-primary transition-colors">
                   <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm text-text-muted">{order.customer_phone || 'No phone provided'}</span>
              </div>
            </div>
            <button className="w-full py-3 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all">
              Customer History
            </button>
          </div>

          {/* Shipping Details */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
              <h3 className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Shipping Destination</h3>
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-bold text-text-primary leading-relaxed">
                <p>{shippingAddress.street || 'No street provided'}</p>
                <p>{[shippingAddress.city, shippingAddress.state].filter(Boolean).join(', ')}</p>
                <p>{[shippingAddress.country, shippingAddress.postal_code].filter(Boolean).join(' ')}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg text-text-muted">
                       <Truck className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-text-primary">GIG Logistics</p>
                       <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Tracking: {order.tracking_number || 'PENDING'}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
            {order.payment_status === 'paid' && (
               <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center rotate-12">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-20" />
               </div>
            )}
            <h3 className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-6 border-b border-border pb-2">Transaction Detail</h3>
            <div className={`rounded-xl p-4 mb-4 ${order.payment_status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-yellow-50 dark:bg-yellow-500/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${order.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-yellow-500'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase ${order.payment_status === 'paid' ? 'text-emerald-700' : 'text-yellow-700'}`}>
                    {order.payment_status === 'paid' ? 'Payment Verified' : 'Awaiting Payment'}
                  </p>
                  <p className={`text-[10px] font-bold ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                    Method: {order.payment_method?.toUpperCase() || 'PAYSTACK'}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center group">
                <span className="text-[10px] font-bold text-text-muted uppercase">Reference</span>
                <span className="text-[10px] font-bold text-text-primary font-mono select-all">{order.payment_reference || 'N/A'}</span>
              </div>
               {order.payment_reference && (
                  <a 
                    href={`https://dashboard.paystack.com/#/transactions/${order.payment_reference}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-secondary hover:bg-border transition-colors rounded-lg text-[10px] font-bold uppercase text-text-primary"
                  >
                    Paystack Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
