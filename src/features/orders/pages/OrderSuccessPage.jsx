/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/orders/pages/OrderSuccessPage.jsx */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle, Loader2, Mail, Package, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useVerifyPayment } from '../../../hooks/useOrders';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const verifyPaymentMutation = useVerifyPayment();
  const hasVerified = useRef(false);
  const reference = searchParams.get('reference');
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(Boolean(reference));

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference || hasVerified.current) return;
      hasVerified.current = true;
      setIsVerifying(true);

      try {
        const result = await verifyPaymentMutation.mutateAsync(reference);

        if (result.status !== 'success') {
          setVerificationError('Payment was not successful. Please try again or contact support.');
          return;
        }

        setVerifiedOrder(result.order);
        clearCart();
      } catch (error) {
        setVerificationError(error?.response?.data?.message || 'Could not verify payment. Please contact support.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [clearCart, reference, verifyPaymentMutation]);

  const orderNumber = verifiedOrder?.order_number || state?.order_number || '-';
  const orderUuid = verifiedOrder?.order_uuid || state?.order_uuid || searchParams.get('order');
  const total = verifiedOrder?.total || state?.total;
  const email = verifiedOrder?.email || state?.email || searchParams.get('email');

  if (reference && isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-2">Verifying Payment</h1>
          <p className="text-text-muted text-sm">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-2">Payment Not Confirmed</h1>
          <p className="text-text-muted text-sm mb-6">{verificationError}</p>
          <div className="flex flex-col gap-3">
            <Link to="/checkout" className="px-6 py-3 bg-primary text-white font-medium rounded-full">
              Return to Checkout
            </Link>
            <Link to="/contact" className="px-6 py-3 border border-border text-text-primary font-medium rounded-full">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-3">
          Order Confirmed!
        </h1>
        <p className="text-text-muted text-sm mb-8 leading-relaxed">
          Thank you for your purchase. We've received your payment and will begin processing your order shortly.
          {email && (
            <> A confirmation email has been sent to <strong className="text-text-primary">{email}</strong>.</>
          )}
        </p>

        <div className="bg-surface border border-border rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <Package className="w-4 h-4" />
              <span>Order Number</span>
            </div>
            <span className="font-bold text-text-primary font-mono">{orderNumber}</span>
          </div>

          {total && (
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-sm">Total Paid</span>
              <span className="font-bold text-primary text-lg">
                ₦{parseFloat(total).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <Mail className="w-4 h-4" />
              <span>Status Updates</span>
            </div>
            <span className="text-sm text-text-primary">{email || '-'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 ? 'bg-primary text-white' : 'bg-secondary text-text-muted'}`}>
                  {i + 1}
                </div>
                <span className="text-[9px] text-text-muted hidden md:block">{step}</span>
              </div>
              {i < 3 && <div className="w-6 md:w-10 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderUuid && email && (
            <Link
              to={`/orders/${orderUuid}?email=${encodeURIComponent(email)}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all"
            >
              Track My Order
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-text-primary font-medium rounded-full hover:border-primary hover:text-primary transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
