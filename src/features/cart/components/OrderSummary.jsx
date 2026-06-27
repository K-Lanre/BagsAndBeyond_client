import React, { useState } from 'react';
import { Tag, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useValidateCoupon } from '../../../hooks/useOrders';

export function OrderSummary({ 
  subtotal, 
  shipping = 0, 
  shippingLabel,
  discount = 0, 
  total,
  onCheckout,
  onApplyCoupon
}) {
  const [promoCode, setPromoCode] = useState('');
  const validateMutation = useValidateCoupon();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    try {
      const couponData = await validateMutation.mutateAsync({ 
        code: promoCode, 
        subtotal 
      });
      onApplyCoupon(couponData);
      toast.success(couponData.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid promo code');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-serif font-bold text-text-primary">
        Order Summary
      </h2>

      {/* Promo Code */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Promo Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={handleApplyPromo}
            disabled={validateMutation.isPending}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover disabled:opacity-70 transition-colors"
          >
            {validateMutation.isPending ? '...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text-primary">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Shipping</span>
          <span className={shippingLabel ? 'text-text-muted' : shipping === 0 ? 'text-green-600' : 'text-text-primary'}>
            {shippingLabel || (shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Discount</span>
            <span className="text-green-600">-₦{discount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <span className="font-medium text-text-primary">Total</span>
        <span className="text-2xl font-bold text-primary">
          ₦{total.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 pt-4 text-[10px] text-text-muted">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secure Checkout
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Fast Delivery
        </span>
      </div>
    </div>
  );
}
