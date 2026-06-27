/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/pages/FAQPage.jsx */
import { useState } from 'react';
import { ChevronDown, HelpCircle, Truck, RotateCcw, CreditCard, Package } from 'lucide-react';

const faqCategories = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'products', label: 'Products', icon: Package },
];

const faqs = [
  {
    id: 1,
    category: 'shipping',
    question: 'How long does delivery take?',
    answer: 'Lagos Metro: 1-2 business days. Southwest Region: 3-5 business days. Other Nigerian states: 5-7 business days. International orders (UK/EU): 7-14 business days via DHL.'
  },
  {
    id: 2,
    category: 'shipping',
    question: 'What are the shipping costs?',
    answer: 'Lagos Metro: ₦2,500. Southwest Region: ₦5,000. Other Nigerian states: ₦7,000. International UK/EU: ₦25,000. Free shipping on orders over ₦50,000.'
  },
  {
    id: 3,
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to the UK and EU via DHL Global Priority. International shipping rates start at ₦25,000. Delivery takes 7-14 business days.'
  },
  {
    id: 4,
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We accept returns within 14 days of delivery. Items must be unused, in original packaging with all tags attached. Sale items are final sale unless defective.'
  },
  {
    id: 5,
    category: 'returns',
    question: 'How do I initiate a return?',
    answer: 'Email us at returns@bagsandbeyond.ng with your order number and reason for return. We will send you a return shipping label. Refunds are processed within 5-7 business days after we receive the item.'
  },
  {
    id: 6,
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Paystack (Card, Bank Transfer, USSD), and Cash on Delivery for Lagos orders only. All transactions are secure and encrypted.'
  },
  {
    id: 7,
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use Paystack for payment processing which is PCI DSS compliant. We do not store your card details on our servers.'
  },
  {
    id: 8,
    category: 'products',
    question: 'Are your products authentic?',
    answer: 'Yes, all our products are 100% authentic. We source directly from authorized distributors and reputable manufacturers. Each item comes with original tags and authenticity cards where applicable.'
  },
  {
    id: 9,
    category: 'products',
    question: 'How do I care for my leather bags?',
    answer: 'Use a soft, damp cloth to wipe clean. Avoid direct sunlight and moisture. Store in the provided dust bag when not in use. Use leather conditioner every 3-6 months.'
  },
  {
    id: 10,
    category: 'products',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, complimentary gift wrapping is available. Select the option at checkout and add a personalized message. Gift receipts exclude pricing information.'
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('shipping');
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            How Can We Help?
          </h1>
          <p className="text-white/80">
            Find answers to frequently asked questions
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {faqCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white'
                    : 'bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1E1E1E]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openItems.includes(faq.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-12 text-center">
          <HelpCircle className="w-12 h-12 text-[#FF6B8A] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-500 mb-4">
            Can't find the answer you're looking for? Please contact us.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
