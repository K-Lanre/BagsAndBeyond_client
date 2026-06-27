/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/ReturnsPage.jsx */
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

export default function ReturnsPage() {
  const policies = [
    {
      icon: Clock,
      title: '14-Day Returns',
      description: 'Items can be returned within 14 days of delivery for a full refund.',
    },
    {
      icon: CheckCircle,
      title: 'Original Condition',
      description: 'Items must be unworn, unused, and in original packaging with all tags attached.',
    },
    {
      icon: XCircle,
      title: 'Non-Returnable Items',
      description: 'Sale items, underwear, and personalized products cannot be returned.',
    },
  ];

  const steps = [
    'Contact us within 14 days of receiving your order',
    'Provide your order number and reason for return',
    'We will send you a return authorization and shipping label',
    'Package the item securely and attach the return label',
    'Drop off at any of our partner locations',
    'Refund processed within 5-7 business days after we receive the item',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Returns & Refunds
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Hassle-free returns within 14 days
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Policy Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <div
                key={policy.title}
                className="bg-white dark:bg-[#141414] rounded-2xl p-6 shadow-sm text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {policy.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {policy.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Return Process */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              How to Return
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-100 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">{idx + 1}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Info */}
        <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Refund Information
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Refunds are processed to the original payment method</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Please allow 5-7 business days after we receive your return</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>You will receive an email confirmation once your refund is processed</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Shipping costs are non-refundable unless the item was defective</span>
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Need Help with a Return?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our customer service team is here to assist you
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
