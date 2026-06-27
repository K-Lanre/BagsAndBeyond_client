/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/orders/pages/OrderConfirmationPage.jsx */
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, PartyPopper } from 'lucide-react';
import { getProductImageUrl } from '../../../utils/productImages';

export default function OrderConfirmationPage() {
  const location = useLocation();

  // Get order data from navigation state
  const orderData = location.state || {
    orderId: 'BAB-00164',
    total: 138500,
    items: [
      { id: 1, name: 'Elegance Tote', image: '/landing/2.jfif', price: 72000, quantity: 1 },
      { id: 2, name: 'Silk Stilettos', image: '/landing/3.jfif', price: 45000, quantity: 1 },
      { id: 3, name: 'Minimalist Wallet', image: '/landing/4.jfif', price: 21500, quantity: 1 },
    ],
  };

  const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getOrderItemImage = (item) => getProductImageUrl([item.image]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {/* Success Animation */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <PartyPopper className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-2">
            Order Confirmed!
          </h1>
          <p className="text-text-muted text-sm">
            Thank you for shopping with BagsAndBeyond
          </p>
        </div>

        {/* Order Number */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Order Number</p>
          <p className="text-2xl font-bold text-primary">#{orderData.orderId}</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-8">
          <h2 className="text-lg font-bold text-text-primary mb-6">Items in your order</h2>

          <div className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={getOrderItemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = '/landing/Bags Collection.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary text-sm">{item.name}</p>
                  <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-text-primary">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border my-6" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Total Amount</span>
            <span className="text-xl font-bold text-primary">
              ₦{orderData.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/track-order"
            className="flex-1 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors text-center"
          >
            Track Orders
          </Link>
          <Link
            to="/shop"
            className="flex-1 py-4 border-2 border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar Style */}
        <div className="mt-10 bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-bold text-text-primary mb-4">Order Summary</h3>

          {orderData.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3 mb-3">
              <img
                src={getOrderItemImage(item)}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(event) => {
                  event.currentTarget.src = '/landing/Bags Collection.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary truncate">{item.name}</p>
                <p className="text-[10px] text-text-muted">Qty: {item.quantity}</p>
              </div>
              <p className="text-xs font-medium text-green-600">COMPLETED</p>
            </div>
          ))}

          <div className="border-t border-border mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-primary">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2">
              <span className="text-text-primary">Total</span>
              <span className="text-primary">₦{orderData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-50">
        <div className="flex gap-3">
          <Link
            to="/"
            className="flex-1 py-3 bg-secondary text-text-primary font-medium rounded-full text-center flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/shop"
            className="flex-1 py-3 bg-primary text-white font-medium rounded-full text-center flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
