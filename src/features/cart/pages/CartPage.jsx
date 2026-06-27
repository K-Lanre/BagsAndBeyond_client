import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Home, Store, User, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../../contexts/CartContext';
import { OrderSummary } from '../components/OrderSummary';
import { getProductImageUrl } from '../../../utils/productImages';
import { useProducts } from '../../../hooks/useProducts';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { data: recommendedProducts, isLoading: isLoadingRecommendations } = useProducts({ limit: 4, sort: 'newest' });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const getCartImage = (item) => getProductImageUrl([item.image]);
  const recommendations = recommendedProducts?.products || [];

  const handleUpdateQuantity = (key, newQuantity) => {
    updateQuantity(key, newQuantity);
    setAppliedCoupon(null); // Reset coupon if quantity changes to re-validate
  };

  const handleRemove = (key) => {
    removeFromCart(key);
    toast.success('Item removed from cart');
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { couponCode: appliedCoupon?.code } });
  };

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * parseFloat(appliedCoupon.value)) / 100;
    } else if (appliedCoupon.type === 'flat') {
      discount = parseFloat(appliedCoupon.value);
    }
  }

  const total = Math.max(0, subtotal + shipping - discount);

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 lg:pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary font-medium">Shopping Bag</span>
          </nav>

          {/* Empty Cart Content */}
          <div className="flex flex-col items-center text-center py-12 lg:py-20">
            {/* Bag Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-primary" strokeWidth={1.5} />
              </div>
              {/* <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-surface rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">😔</span>
              </div> */}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-text-primary mb-4">
              Your cart is empty
            </h1>
            <p className="text-text-muted max-w-md mb-8 text-sm md:text-base">
              Looks like you haven't added anything yet. Discover our latest collection of premium bags and shoes.
            </p>
            <Link
              to="/shop"
              className="px-10 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-primary/30"
            >
              Start Shopping
            </Link>
          </div>

          {/* Product Recommendations */}
          {(isLoadingRecommendations || recommendations.length > 0) && (
          <div className="mt-12 lg:mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {isLoadingRecommendations ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-2xl p-3"
                >
                  <div className="aspect-square rounded-xl bg-secondary/30 animate-pulse mb-3" />
                  <div className="h-3 w-2/3 mx-auto rounded bg-secondary/30 animate-pulse" />
                </div>
              )) : recommendations.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug || product.id}`}
                  className="group bg-surface border border-border rounded-2xl p-3 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20 mb-3">
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(event) => {
                        event.currentTarget.src = '/landing/Bags Collection.png';
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted text-center font-medium">
                    {product.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-3 z-50">
          <div className="flex items-center justify-around">
            <Link to="/" className="flex flex-col items-center gap-1 text-text-muted">
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center gap-1 text-primary">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px]">Bag</span>
            </Link>
            <Link to="/shop" className="flex flex-col items-center gap-1 text-text-muted">
              <Store className="w-5 h-5" />
              <span className="text-[10px]">Shop</span>
            </Link>
            <Link to="/track-order" className="flex flex-col items-center gap-1 text-text-muted">
              <User className="w-5 h-5" />
              <span className="text-[10px]">Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-primary font-medium">Shopping Bag</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-2">
            Shopping Bag
          </h1>
          <p className="text-text-muted text-sm">
            Review your selected items to proceed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-surface border border-border rounded-2xl"
              >
                {/* Product Image */}
                <Link to={`/product/${item.slug || item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-secondary/10 rounded-xl overflow-hidden">
                    <img
                      src={getCartImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = '/landing/Bags Collection.png';
                      }}
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/product/${item.slug || item.id}`}>
                        <h3 className="font-medium text-text-primary text-sm md:text-base hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-text-muted mt-1">
                        {item.color && `Color: ${item.color}`}
                        {item.size && item.color && ' | '}
                        {item.size && `Size: ${item.size}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.slug || item.id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.slug || item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary disabled:opacity-40 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium text-text-primary min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.slug || item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-text-primary">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Link */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mt-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                shippingLabel="Calculated at checkout"
                discount={discount}
                total={total}
                onCheckout={handleCheckout}
                onApplyCoupon={handleApplyCoupon}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-3 z-50">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center gap-1 text-text-muted">
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center gap-1 text-primary">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            </div>
            <span className="text-[10px]">Bag</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-1 text-text-muted">
            <Store className="w-5 h-5" />
            <span className="text-[10px]">Shop</span>
          </Link>
          <Link to="/track-order" className="flex flex-col items-center gap-1 text-text-muted">
            <User className="w-5 h-5" />
            <span className="text-[10px]">Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
