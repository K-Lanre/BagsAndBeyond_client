/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/ContactPage.jsx */
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF6B8A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#FF6B8A]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-500 dark:text-gray-400">+234 800 123 4567</p>
                  <p className="text-sm text-gray-400">Mon-Fri, 9am-6pm WAT</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF6B8A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#FF6B8A]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-500 dark:text-gray-400">hello@bagsandbeyond.ng</p>
                  <p className="text-sm text-gray-400">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF6B8A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#FF6B8A]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Address</h3>
                  <p className="text-gray-500 dark:text-gray-400">12 Admiralty Way, Lekki Phase 1</p>
                  <p className="text-gray-500 dark:text-gray-400">Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF6B8A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#FF6B8A]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Working Hours</h3>
                  <p className="text-gray-500 dark:text-gray-400">Monday - Friday: 9am - 6pm</p>
                  <p className="text-gray-500 dark:text-gray-400">Saturday: 10am - 4pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#141414] rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-6">
              Send a Message
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#FF6B8A]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#FF6B8A]"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#FF6B8A]"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#FF6B8A]"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
