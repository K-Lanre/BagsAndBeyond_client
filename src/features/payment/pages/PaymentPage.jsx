/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/payment/pages/PaymentPage.jsx */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, CreditCard, ArrowLeft, Wallet, Building2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../../contexts/CartContext';

const paymentMethods = [
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Cards, Bank Transfer, USSD',
    color: '#011B33',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8v-2h3V7h2v4h3v2h-3v4h-2z" />
      </svg>
    ),
  },
  {
    id: 'monnify',
    name: 'Monnify',
    description: 'Bank Transfer, Cards',
    color: '#0066CC',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'opay',
    name: 'OPay',
    description: 'Wallet, Transfer, Cards',
    color: '#1B8B3B',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-6h2v-2h-2v2zm0 4h2v-2h-2v2z" />
      </svg>
    ),
  },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('paystack');

  // Get order data from navigation state or calculate from cart
  const orderData = location.state?.orderData || {
    orderId: 'BAB-' + Date.now().toString(36).toUpperCase(),
    items: cartItems,
    subtotal: getCartTotal(),
    shipping: getCartTotal() > 50000 ? 0 : 1500,
  };

  const total = orderData.subtotal + orderData.shipping;

  // Redirect if no items
  if (cartItems.length === 0 && !location.state?.orderData) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-4">No order to pay for</h1>
          <Link to="/shop" className="px-8 py-4 bg-primary text-white rounded-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    setIsProcessing(true);
    const method = paymentMethods.find(m => m.id === selectedMethod);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      toast.success(`Payment successful via ${method.name}!`);
      navigate('/order-confirmation', {
        state: {
          orderId: orderData.orderId,
          total: total,
          items: orderData.items,
        },
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Checkout</span>
        </button>

        {/* Progress Step */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-primary font-medium">Step 3 of 3</span>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          <div className="flex-1 h-1 bg-primary rounded-full" />
          <div className="flex-1 h-1 bg-primary rounded-full" />
          <div className="flex-1 h-1 bg-primary rounded-full" />
        </div>

        {/* Amount Due */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Amount Due</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary">
            ₦{total.toLocaleString()}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium uppercase tracking-wider">Secure Transaction</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-text-primary mb-4">Select Payment Method</p>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-surface hover:border-primary/50'
                  }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: method.color }}
                >
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-text-primary">{method.name}</p>
                  <p className="text-xs text-text-muted">{method.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethod === method.id
                      ? 'border-primary bg-primary'
                      : 'border-border'
                    }`}
                >
                  {selectedMethod === method.id && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Payment Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: paymentMethods.find(m => m.id === selectedMethod)?.color }}
            >
              {paymentMethods.find(m => m.id === selectedMethod)?.icon}
            </div>
            <div className="text-center">
              <p className="font-bold text-text-primary">
                {paymentMethods.find(m => m.id === selectedMethod)?.name}
              </p>
              <p className="text-xs text-text-muted">Secure Checkout</p>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ₦{total.toLocaleString()} with {paymentMethods.find(m => m.id === selectedMethod)?.name}
              </>
            )}
          </button>

          {/* Accepted Payment Types */}
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-wider text-text-muted text-center mb-4">
              Accepted Payment Methods
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <CreditCard className="w-6 h-6 text-text-muted" />
                <span className="text-[10px] text-text-muted">VISA</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wallet className="w-6 h-6 text-text-muted" />
                <span className="text-[10px] text-text-muted">VERVE</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Building2 className="w-6 h-6 text-text-muted" />
                <span className="text-[10px] text-text-muted">TRANSFER</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-yellow-500" />
                <span className="text-[10px] text-text-muted">MASTERCARD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-secondary/20 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary text-sm mb-1">Encrypted & Private</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Your payment information is processed securely. We never store your card details on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-text-muted">Total Amount</span>
            <span className="text-lg font-bold text-text-primary">₦{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-2 text-sm text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Edit Order
          </button>
        </div>

        {/* Items Summary */}
        <div className="mt-6 space-y-3">
          {orderData.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{item.name} x {item.quantity}</span>
              <span className="text-text-primary">₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <span className="text-text-muted">Shipping ({orderData.shipping === 0 ? 'Free' : 'Standard'})</span>
            <span className="text-text-primary">
              {orderData.shipping === 0 ? 'FREE' : `₦${orderData.shipping.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
