/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/home/components/Benefits.jsx */
import { Truck, ShieldCheck, ArchiveRestore } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: "Smart Shipping",
      description: "Location-aware rates for local and international orders."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Secure Paystack Checkout",
      description: "Your transactions are safe and encrypted."
    },
    {
      icon: <ArchiveRestore className="w-6 h-6 text-primary" />,
      title: "Easy Returns",
      description: "7-day hassle-free return policy."
    }
  ];

  return (
    <section className="py-12 md:py-20 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-12 md:space-y-0 md:flex-row md:justify-between items-start">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-6 group">
              <div className="w-16 h-16 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-110">
                {benefit.icon}
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-lg font-serif font-bold text-text-primary">
                  {benefit.title}
                </h3>
                <p className="text-text-muted text-xs leading-relaxed max-w-[200px]">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
