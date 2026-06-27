import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Mail, Package, Truck, CheckCircle, Clock, ChevronLeft, MapPin, CreditCard, ShoppingBag, Loader2, AlertCircle, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInitializePaystack, useOrderDetails } from '../../../hooks/useOrders';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { formatDate, getDateValue } from '../../../utils/date';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusColors = {
  pending: 'text-yellow-500 bg-yellow-50',
  processing: 'text-blue-500 bg-blue-50',
  shipped: 'text-purple-500 bg-purple-50',
  delivered: 'text-green-500 bg-green-50',
  cancelled: 'text-red-500 bg-red-50',
};

import { getProductImageUrl } from '../../../utils/productImages';

const parseShippingAddress = (address) => {
  if (!address) return {};
  if (typeof address !== 'string') return address;

  try {
    return JSON.parse(address);
  } catch (error) {
    return { street: address };
  }
};

export default function OrderDetailPage() {
  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const [emailInput, setEmailInput] = useState(searchParams.get('email') || '');
  const [searchEmail, setSearchEmail] = useState(searchParams.get('email') || '');
  const [verified, setVerified] = useState(!!searchParams.get('email'));
  const isOnline = useOnlineStatus();

  const { data: order, isLoading, isError, error } = useOrderDetails(uuid, searchEmail);
  const initializePaystackMutation = useInitializePaystack();

  const handleVerify = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    if (!isOnline) {
      toast.error('Order lookup needs an internet connection.');
      return;
    }
    setSearchEmail(emailInput);
    setVerified(true);
  };

  const getCurrentStep = (status) => {
    const index = statusSteps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
  };

  const handleRetryPayment = async () => {
    if (!isOnline) {
      toast.error('Payment needs an internet connection.');
      return;
    }

    try {
      const callbackUrl = `${window.location.origin}/order-success?order=${encodeURIComponent(uuid)}&email=${encodeURIComponent(searchEmail)}`;
      const payment = await initializePaystackMutation.mutateAsync({
        order_uuid: uuid,
        email: searchEmail,
        callback_url: callbackUrl,
      });

      toast.success('Redirecting to secure payment...');
      window.location.href = payment.authorization_url;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not restart payment. Please try again.');
    }
  };

  if (!verified || isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-[#FF8E53] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Order Details
            </h1>
            <p className="text-white/80">
              Verify your email to view this order
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-serif font-bold text-text-primary">
                Verify Your Email
              </h2>
              <p className="text-text-muted text-sm mt-2">
                Enter the email address used when placing this order
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {!isOnline && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/20">
                  <WifiOff className="w-4 h-4" />
                  <p>Reconnect to verify and view this order.</p>
                </div>
              )}
              <div>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {isError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <p>{error?.response?.data?.message || 'Verification failed. Please check your email.'}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'View Order'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/track-order"
                className="text-sm text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const currentStepIndex = getCurrentStep(order.status);
  const shippingDetails = parseShippingAddress(order.shipping_address);
  const postalCode = shippingDetails?.postal_code || shippingDetails?.postalCode;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-[#FF8E53] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/track-order"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Order #{order.order_number}
          </h1>
          <p className="text-white/80 mt-2">
            Placed on {formatDate(getDateValue(order), {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Progress */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-text-muted'
                      } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] md:text-xs mt-2 font-medium ${isCompleted ? 'text-text-primary' : 'text-text-muted'
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-serif font-bold text-text-primary mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const imageUrl = item.product_image
                  ? getProductImageUrl([item.product_image])
                  : getProductImageUrl(item.product);

                return (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={imageUrl}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg bg-secondary/20"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary text-sm">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Qty: {item.quantity}
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                      <p className="font-bold text-text-primary mt-2">
                        ₦{parseFloat(item.price_at_time * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-primary">₦{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Shipping</span>
                <span className={parseFloat(order.shipping_cost) === 0 ? 'text-green-600' : 'text-text-primary'}>
                  {parseFloat(order.shipping_cost) === 0 ? 'FREE' : `₦${parseFloat(order.shipping_cost).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-2 border-t border-border">
                <span className="text-text-primary">Total</span>
                <span className="text-primary">₦{parseFloat(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-serif font-bold text-text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </h2>
              <div className="text-sm text-text-muted leading-relaxed">
                <p className="font-bold text-text-primary">
                  {order.customer_name}
                </p>
                <p>{shippingDetails?.street}</p>
                <p>{shippingDetails?.city}, {shippingDetails?.state}</p>
                <p>{shippingDetails?.country || 'Nigeria'} {postalCode}</p>
                <p className="mt-2">{order.customer_phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-serif font-bold text-text-primary mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Info
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-text-muted uppercase tracking-wider font-bold">Method</p>
                <p className="text-sm text-text-primary capitalize">{order.payment_method || 'Paystack'}</p>
                <p className="text-sm text-text-muted uppercase tracking-wider font-bold mt-4">Status</p>
                <p className={`text-sm font-bold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment_status}
                </p>
                {order.payment_status !== 'paid' && order.status !== 'cancelled' && (
                  <div className="mt-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 p-3 text-xs text-yellow-700 dark:text-yellow-400">
                    Payment has not been completed for this order. Use Pay Now to continue securely.
                  </div>
                )}
                {order.payment_status !== 'paid' && order.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={handleRetryPayment}
                    disabled={initializePaystackMutation.isPending || !isOnline}
                    className="mt-4 w-full py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-hover disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                  >
                    {initializePaystackMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Preparing Payment...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className={`p-4 rounded-xl ${statusColors[order.status] || 'bg-secondary'}`}>
              <p className="font-bold capitalize text-sm">{order.status}</p>
              <p className="text-xs opacity-80 mt-1">
                {order.status === 'pending' && 'Your order is being processed'}
                {order.status === 'processing' && 'Your order is being prepared'}
                {order.status === 'shipped' && 'Your order is on its way'}
                {order.status === 'delivered' && 'Your order has been delivered'}
                {order.status === 'cancelled' && 'This order has been cancelled'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
