/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/components/Navbar.jsx */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Moon, Sun, User, Menu, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCart } from '../../../contexts/CartContext';
import { cn } from '../../../lib/utils';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Bags', path: '/shop/bags' },
    { name: 'Shoes', path: '/shop/shoes' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-serif font-bold text-xl md:text-2xl text-text-primary">
              BagsAndBeyond
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary border-b-2 border-primary" : "text-text-muted"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen((open) => !open)}
              className="text-text-muted hover:text-primary transition-colors"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/cart" className="text-text-muted hover:text-primary transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link
              to="/track-order"
              className="text-text-muted hover:text-primary transition-colors"
              title="Track your order"
            >
              <User className="h-5 w-5" />
            </Link>
            <button onClick={toggleTheme} className="text-text-muted hover:text-primary transition-colors">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-muted hover:text-primary transition-colors focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags, shoes, SKU..."
                autoFocus
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive ? "text-primary bg-primary/10" : "text-text-muted hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/track-order"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-primary hover:bg-primary/5"
            >
              Track Order
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
