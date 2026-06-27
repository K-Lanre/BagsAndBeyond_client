/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/AboutPage.jsx */
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Heart, Award } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: ShoppingBag,
      title: 'Quality First',
      description: 'We source only premium materials and partner with skilled artisans to create products that last.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Orders are processed within 24 hours and delivered nationwide within 3-5 business days.',
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Your satisfaction is our priority. We are here to help every step of the way.',
    },
    {
      icon: Award,
      title: 'Authentic Products',
      description: 'Every item in our store is carefully curated and verified for authenticity.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            About Bags & Beyond
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Your destination for premium bags and shoes in Nigeria
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg mb-12">
            Founded with a passion for quality and style, Bags & Beyond has grown to become 
            a trusted name in fashion retail across Nigeria. We believe everyone deserves 
            access to premium products without the premium hassle.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white dark:bg-[#141414] rounded-2xl p-6 shadow-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Ready to Shop?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse our collection of premium bags and shoes. No account required.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
