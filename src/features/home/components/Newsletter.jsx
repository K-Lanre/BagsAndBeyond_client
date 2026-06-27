/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/home/components/Newsletter.jsx */
import { useState } from 'react';
import toast from 'react-hot-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Dummy submission
    toast.success('Successfully subscribed!');
    setEmail('');
  };

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
          Get 10% Off Your First Order
        </h2>
        <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto mb-8 font-medium">
          Join our exclusive mailing list to receive early access to new collections and special offers.
        </p>
        
        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0 sm:bg-white/10 sm:p-1.5 sm:rounded-full sm:border sm:border-white/20">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-8 py-4 sm:py-3 rounded-full sm:rounded-r-none bg-white/10 sm:bg-transparent border border-white/20 sm:border-none text-white placeholder-white/60 focus:outline-none transition-all text-sm"
          />
          <button
            type="submit"
            className="px-10 py-4 sm:py-3 rounded-full bg-white text-primary font-bold text-xs tracking-widest uppercase hover:bg-gray-100 transition-all shadow-md hover:shadow-xl shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
