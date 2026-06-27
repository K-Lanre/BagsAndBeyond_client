/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/home/components/PromoBanner.jsx */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function PromoBanner() {
  const [dismissedPromos, setDismissedPromos] = useState(() => {
    return JSON.parse(localStorage.getItem('dismissedPromos') || '[]');
  });

  const { data: activePromos = [] } = useQuery({
    queryKey: ['active-promos'],
    queryFn: async () => {
      const { data } = await api.get('/promos/active');
      return data;
    },
  });

  const promos = useMemo(() => {
    return activePromos
      .map((promo) => ({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        image: promo.image,
        buttonText: promo.button_text,
        buttonLink: promo.button_link,
        position: promo.position
      }))
      .filter((promo) => !dismissedPromos.includes(promo.id));
  }, [activePromos, dismissedPromos]);

  const dismissPromo = (id) => {
    const newDismissed = [...dismissedPromos, id];
    localStorage.setItem('dismissedPromos', JSON.stringify(newDismissed));
    setDismissedPromos(newDismissed);
  };

  if (promos.length === 0) return null;

  const promo = promos[0]; // Show first active promo

  return (
    <div className="relative w-full bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-3 text-white">
            {promo.image && (
              <img
                src={promo.image}
                alt={promo.title}
                className="w-10 h-10 rounded-full object-cover hidden sm:block"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="text-center">
              <span className="font-medium">{promo.title}</span>
              <span className="mx-2 opacity-70">|</span>
              <span className="opacity-90">{promo.subtitle}</span>
            </div>
          </div>
          <Link
            to={promo.buttonLink || '/shop'}
            className="px-4 py-1.5 bg-white text-[#FF6B8A] rounded-full text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            {promo.buttonText || 'Shop Now'}
          </Link>
          <button
            onClick={() => dismissPromo(promo.id)}
            className="p-1 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
