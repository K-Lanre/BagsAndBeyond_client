/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/shop/components/MobileBottomNav.jsx */
import { Link, useLocation } from 'react-router-dom';
import { Compass, PackageSearch, ShoppingBag, ShoppingCart } from 'lucide-react';

const navItems = [
  { name: 'Discover', path: '/', icon: Compass },
  { name: 'Shop', path: '/shop', icon: ShoppingBag },
  { name: 'Bag', path: '/cart', icon: ShoppingCart },
  { name: 'Orders', path: '/track-order', icon: PackageSearch },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for mobile */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
