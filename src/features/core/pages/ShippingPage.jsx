/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/ShippingPage.jsx */
import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Package, ChevronRight } from 'lucide-react';

export default function ShippingPage() {
  const faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 3-5 business days within Nigeria. Express delivery (available in Lagos only) takes 1-2 business days.',
    },
    {
      q: 'How much is shipping?',
      a: 'Standard shipping is ₦1,500 for orders under ₦50,000. Orders over ₦50,000 qualify for FREE shipping.',
    },
    {
      q: 'Do you deliver to all states?',
      a: 'Yes, we deliver to all 36 states in Nigeria plus Abuja.',
    },
    {
      q: 'Can I track my order?',
      a: 'Yes! Use your email address on our Track Order page to see all your orders and their status.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Fast, reliable delivery across Nigeria
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Shipping Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-xl flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Standard Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              3-5 business days nationwide
            </p>
            <p className="text-lg font-semibold text-primary">
              ₦1,500 <span className="text-sm font-normal text-gray-500">or FREE over ₦50,000</span>
            </p>
          </div>

          <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Express Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              1-2 business days (Lagos only)
            </p>
            <p className="text-lg font-semibold text-primary">
              ₦3,000
            </p>
          </div>
        </div>

        {/* Delivery Process */}
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
          How It Works
        </h2>
        <div className="space-y-4 mb-12">
          {[
            { icon: Package, step: '1', title: 'Order Placed', desc: 'We receive and confirm your order' },
            { icon: Clock, step: '2', title: 'Processing', desc: 'Your items are carefully packed' },
            { icon: Truck, step: '3', title: 'Shipped', desc: 'Handed to our delivery partner' },
            { icon: MapPin, step: '4', title: 'Delivered', desc: 'Arrives at your doorstep' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex items-start gap-4 bg-white dark:bg-[#141414] rounded-xl p-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
          Common Questions
        </h2>
        <div className="space-y-4 mb-12">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-[#141414] rounded-xl p-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Track Your Order
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email to see the status of all your orders
          </p>
          <Link
            to="/track-order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Track Order
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
