/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/TermsPage.jsx */
import { FileText, Scale, Truck, RotateCcw, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-white/80">
            Last updated: January 2025
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 md:p-12">
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Agreement to Terms
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By accessing or using Bags and Beyond's website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services. These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Shipping & Delivery
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We deliver nationwide in Nigeria and internationally to the UK and EU. Delivery times are estimates and commence from the date of shipping, not the date of order. We are not responsible for delays caused by customs, weather conditions, or courier issues.
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>Lagos Metro: 1-2 business days (₦2,500)</li>
                <li>Southwest Region: 3-5 business days (₦5,000)</li>
                <li>Other Nigerian States: 5-7 business days (₦7,000)</li>
                <li>International (UK/EU): 7-14 business days (₦25,000)</li>
              </ul>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Returns & Refunds
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We accept returns within 14 days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging. The following items cannot be returned:
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>Sale items (unless defective)</li>
                <li>Gift cards</li>
                <li>Personalized or customized items</li>
                <li>Items without original tags or packaging</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                Refunds will be processed to the original payment method within 5-7 business days of receiving the returned item. Shipping costs are non-refundable.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Product Authenticity
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                All products sold on Bags and Beyond are 100% authentic. We source directly from authorized distributors and reputable manufacturers. Counterfeit items are strictly prohibited. If you believe you have received a counterfeit item, please contact us immediately for a full refund and investigation.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Order Cancellation
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Orders can be cancelled within 2 hours of placement. Once an order has been processed and shipped, it cannot be cancelled but may be returned according to our return policy. To cancel an order, contact us immediately at hello@bagsandbeyond.ng with your order number.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>Email:</strong> hello@bagsandbeyond.ng</p>
                <p><strong>Address:</strong> 12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
                <p><strong>Phone:</strong> +234 800 123 4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
