import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';

export function OrderTrackingCTA() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error('Please enter the email used at checkout.');
      return;
    }

    navigate(`/track-order?email=${encodeURIComponent(trimmedEmail)}`);
  };

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-primary text-white p-8 md:p-12 flex flex-col justify-center">
            <PackageSearch className="w-10 h-10 mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
              Already placed an order?
            </h2>
            <p className="text-white/85 mt-4 text-sm md:text-base leading-relaxed max-w-md">
              Customers do not need accounts. Use the same email from checkout to view previous orders, payment status, and delivery progress.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 flex flex-col justify-center">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
              Order Email
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors"
              >
                Track
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-4">
              Use the email address entered during checkout.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
