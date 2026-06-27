import { CreditCard, PackageSearch, ShieldCheck, Truck } from 'lucide-react';

const items = [
  {
    icon: ShieldCheck,
    label: 'Guest Checkout',
    text: 'Buy without creating an account.'
  },
  {
    icon: CreditCard,
    label: 'Secure Payment',
    text: 'Pay safely through Paystack.'
  },
  {
    icon: Truck,
    label: 'Smart Shipping',
    text: 'Local and international rates.'
  },
  {
    icon: PackageSearch,
    label: 'Email Tracking',
    text: 'Find previous orders by email.'
  }
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
