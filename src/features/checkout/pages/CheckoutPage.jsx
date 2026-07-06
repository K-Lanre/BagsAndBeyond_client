/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/checkout/pages/CheckoutPage.jsx */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MapPin, CreditCard, Check, Home, Store, User, ShoppingBag, Mail, Loader2, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../../contexts/CartContext';
import { useCalculateShipping, useCreateOrder, useInitializePaystack } from '../../../hooks/useOrders';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { getCustomerData, saveCustomerData } from '../../../utils/customerStorage';
import { getProductImageUrl } from '../../../utils/productImages';

const nigeriaStates = [
  'Lagos', 'Abuja', 'Rivers', 'Oyo', 'Kano', 'Delta', 'Kaduna', 'Ogun', 'Anambra', 'Enugu',
  'Ondo', 'Osun', 'Kwara', 'Plateau', 'Kogi', 'Edo', 'Cross River', 'Akwa Ibom', 'Imo', 'Abia'
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [saveAddress, setSaveAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('paystack');
  const [shippingCost, setShippingCost] = useState(0);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const isOnline = useOnlineStatus();
  const appliedCoupon = location.state?.appliedCoupon || null;

  const createOrderMutation = useCreateOrder();
  const calculateShippingMutation = useCalculateShipping();
  const initializePaystackMutation = useInitializePaystack();

  const [shippingDetails, setShippingDetails] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    country: 'Nigeria',
    city: '',
    state: 'Lagos',
    postalCode: '',
  });

  useEffect(() => {
    const customerData = getCustomerData();
    if (customerData) {
      setShippingDetails(prev => ({
        ...prev,
        email: customerData.email || '',
        fullName: customerData.name || '',
        phoneNumber: customerData.phone || '',
        streetAddress: customerData.shippingAddress?.street || '',
        country: customerData.shippingAddress?.country || 'Nigeria',
        city: customerData.shippingAddress?.city || '',
        state: customerData.shippingAddress?.state || 'Lagos',
        postalCode: customerData.shippingAddress?.postalCode || '',
      }));
      setSaveAddress(true);
    }
  }, []);

  const subtotal = getCartTotal();
  const shipping = shippingCost;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (subtotal * parseFloat(appliedCoupon.value || 0)) / 100
      : appliedCoupon.type === 'flat'
        ? parseFloat(appliedCoupon.value || 0)
        : appliedCoupon.type === 'free_shipping'
          ? shipping
          : 0
    : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const getCartImage = (item) => getProductImageUrl([item.image]);

  useEffect(() => {
    let isCurrent = true;

    const calculateShipping = async () => {
      if (cartItems.length === 0) return;
      setIsShippingLoading(true);

      try {
        const result = await calculateShippingMutation.mutateAsync({
          subtotal,
          country: shippingDetails.country,
          state: shippingDetails.state,
          city: shippingDetails.city,
        });

        if (isCurrent) {
          setShippingCost(parseFloat(result.shipping_cost || 0));
        }
      } catch (error) {
        if (isCurrent) {
          setShippingCost(subtotal >= 50000 ? 0 : 1500);
        }
      } finally {
        if (isCurrent) {
          setIsShippingLoading(false);
        }
      }
    };

    calculateShipping();

    return () => {
      isCurrent = false;
    };
  }, [cartItems.length, shippingDetails.city, shippingDetails.country, shippingDetails.state, subtotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (!isOnline) {
      toast.error('Checkout needs an internet connection. Please reconnect and try again.');
      return;
    }

    const { email, fullName, phoneNumber, streetAddress, country, city, state } = shippingDetails;
    if (!email || !fullName || !phoneNumber || !streetAddress || !country || !city || !state) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isShippingLoading) {
      toast.error('Please wait while shipping is being calculated.');
      return;
    }

    if (saveAddress) {
      saveCustomerData({
        email: shippingDetails.email,
        name: shippingDetails.fullName,
        phone: shippingDetails.phoneNumber,
        shippingAddress: {
          street: shippingDetails.streetAddress,
          country: shippingDetails.country,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.postalCode,
        }
      });
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (selectedPayment !== 'paystack') {
      toast.error('Only Paystack is available right now.');
      return;
    }

    // Step 3: Place order, then hand off to Paystack
    const orderPayload = {
      customer_email: shippingDetails.email,
      customer_name: shippingDetails.fullName,
      customer_phone: shippingDetails.phoneNumber,
      shipping_address: {
        street: shippingDetails.streetAddress,
        country: shippingDetails.country,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postal_code: shippingDetails.postalCode,
      },
      items: cartItems.map(item => ({
        slug: item.slug || String(item.id),
        quantity: item.quantity,
      })),
      payment_method: selectedPayment,
      coupon_code: location.state?.couponCode,
    };

    try {
      const result = await createOrderMutation.mutateAsync(orderPayload);

      const callbackUrl = `${window.location.origin}/order-success?order=${encodeURIComponent(result.order_uuid)}&email=${encodeURIComponent(shippingDetails.email)}`;
      const payment = await initializePaystackMutation.mutateAsync({
        order_uuid: result.order_uuid,
        email: shippingDetails.email,
        callback_url: callbackUrl,
      });

      toast.success('Redirecting to secure payment...');
      window.location.href = payment.authorization_url;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    }
  };

  const steps = [
    { id: 1, label: 'Delivery Address', icon: MapPin },
    { id: 2, label: 'Review Order', icon: Check },
    { id: 3, label: 'Payment', icon: CreditCard },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-4">Your cart is empty</h1>
          <p className="text-text-muted mb-8">Add some items to proceed with checkout.</p>
          <Link to="/shop" className="px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
        {/* Header with Progress */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-primary transition-colors">Shopping Bag</Link>
            <span>/</span>
            <span className="text-primary font-medium">Checkout</span>
          </nav>

          {/* Progress Steps */}
          <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${currentStep >= step.id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted border border-border'
                    }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 md:w-12 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-text-primary mb-2">
                  Shipping Details
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  Please provide your delivery destination
                </p>

                {!isOnline && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p>Checkout is paused while offline. Reconnect to calculate shipping and place your order.</p>
                  </div>
                )}

                <form className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <div className="flex">
                      <span className="px-4 py-3 bg-secondary/30 border border-r-0 border-border rounded-l-xl text-text-muted">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={shippingDetails.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-r-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Your order confirmation will be sent here
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <div className="flex">
                      <span className="px-4 py-3 bg-secondary/30 border border-r-0 border-border rounded-l-xl text-text-muted text-sm font-medium">
                        +234
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={shippingDetails.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="XXX XXX XXXX"
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-r-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={shippingDetails.streetAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={shippingDetails.country}
                        onChange={handleInputChange}
                        placeholder="Nigeria"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                        State *
                      </label>
                      <input
                        list="nigeria-states"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        placeholder="State / Region"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      />
                      <datalist id="nigeria-states">
                        {nigeriaStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingDetails.postalCode}
                        onChange={handleInputChange}
                        placeholder="100001"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Save Address Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="saveAddress" className="text-sm text-text-muted cursor-pointer">
                      Save this address for future purchases
                    </label>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-text-primary mb-6">
                  Review Your Order
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-background rounded-xl">
                      <img
                        src={getCartImage(item)}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(event) => {
                          event.currentTarget.src = '/landing/Bags Collection.png';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary text-sm">{item.name}</h3>
                        <p className="text-xs text-text-muted mt-1">
                          Qty: {item.quantity}
                          {item.color && ` | Color: ${item.color}`}
                        </p>
                        <p className="font-bold text-text-primary mt-2">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-text-primary text-sm">Delivery Address</p>
                      <p className="text-text-muted text-sm mt-1">
                        {shippingDetails.fullName}<br />
                        {shippingDetails.streetAddress}, {shippingDetails.city}<br />
                        {shippingDetails.state}, {shippingDetails.country}
                        {shippingDetails.postalCode && ` ${shippingDetails.postalCode}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-text-primary mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${selectedPayment === 'paystack' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <input type="radio" name="payment" value="paystack" checked={selectedPayment === 'paystack'} onChange={() => setSelectedPayment('paystack')} className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Paystack</p>
                      <p className="text-xs text-text-muted">Pay securely with card or bank transfer</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-white px-2 py-1 rounded border">VISA</span>
                      <span className="text-xs bg-white px-2 py-1 rounded border">MC</span>
                    </div>
                  </label>

                  <div className="rounded-xl border border-dashed border-border bg-background px-4 py-4">
                    <p className="font-medium text-text-primary">Other payment methods</p>
                    <p className="text-xs text-text-muted mt-1">Coming soon.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Cart
                </Link>
              )}

              <button
                onClick={handleContinue}
                disabled={!isOnline || isShippingLoading || createOrderMutation.isPending || initializePaystackMutation.isPending}
                className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-hover disabled:opacity-70 transition-all flex items-center gap-2"
              >
                {isShippingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating Shipping...
                  </>
                ) : createOrderMutation.isPending || initializePaystackMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing Payment...
                  </>
                ) : currentStep === 3 ? (
                  'Place Order'
                ) : (
                  <>
                    Continue
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-serif font-bold text-text-primary mb-6">Your Order</h3>

              {/* Delivery Address Summary */}
              {currentStep > 1 && (
                <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium text-text-primary">Delivery Address</p>
                      <p className="text-text-muted mt-1">
                        {shippingDetails.fullName}<br />
                        {shippingDetails.streetAddress}<br />
                        {shippingDetails.city}, {shippingDetails.state}<br />
                        {shippingDetails.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={getCartImage(item)}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(event) => {
                        event.currentTarget.src = '/landing/Bags Collection.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                {cartItems.length > 2 && (
                  <p className="text-xs text-text-muted text-center">
                    +{cartItems.length - 2} more items
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text-primary">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Shipping (Standard)</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-text-primary'}>
                    {isShippingLoading ? 'Calculating...' : shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">
                      Discount{appliedCoupon?.code ? ` (${appliedCoupon.code})` : ''}
                    </span>
                    <span className="text-green-600">-â‚¦{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                <span className="font-medium text-text-primary">Total Payable</span>
                <span className="text-xl font-bold text-primary">₦{total.toLocaleString()}</span>
              </div>

              {/* Secure Payment Badge */}
              <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-green-700 dark:text-green-400 font-medium">Secure checkout</span>
              </div>

              <p className="text-[10px] text-text-muted text-center mt-4">
                By placing this order you agree to our Terms of Service
              </p>
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
          <Link to="/cart" className="flex flex-col items-center gap-1 text-text-muted">
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
