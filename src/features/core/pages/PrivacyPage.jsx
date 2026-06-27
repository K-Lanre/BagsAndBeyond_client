/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/PrivacyPage.jsx */
import { Shield, Eye, Lock, Server, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/80">
            Your privacy is important to us
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 md:p-12">
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Information We Collect
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>Place an order (name, email, phone, shipping address)</li>
                <li>Contact our customer service</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in promotions or surveys</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                <strong>Important:</strong> We do not store payment card details. All payments are processed securely through Paystack, our payment processor.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support</li>
                <li>Send marketing communications (if you opted in)</li>
                <li>Improve our products and services</li>
              </ul>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Data Security
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Data Retention
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Order information is retained for 7 years for accounting and tax purposes. You may request deletion of your personal data by contacting us.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
                Third-Party Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may employ third-party companies and individuals to facilitate our services ("Service Providers"), provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-[#FF6B8A]" />
                <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white m-0">
                  Contact Us
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>Email:</strong> privacy@bagsandbeyond.ng</p>
                <p><strong>Address:</strong> 12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
