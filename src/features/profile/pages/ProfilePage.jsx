/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/profile/pages/ProfilePage.jsx */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
  User,
  HelpCircle,
  Store,
  ArrowLeft,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

// Sample recently viewed products
const recentlyViewed = [
  { id: 1, name: 'Elegance Tote', image: '/landing/2.jfif', price: 72000 },
  { id: 2, name: 'Silk Stilettos', image: '/landing/3.jfif', price: 45000 },
  { id: 3, name: 'Leather Wallet', image: '/landing/4.jfif', price: 21500 },
  { id: 4, name: 'Classic Sneakers', image: '/landing/1.jfif', price: 38000 },
];

// Desktop sidebar navigation items
const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/profile' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/orders' },
  { id: 'addresses', label: 'Addresses', icon: MapPin, href: '/profile/addresses' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/profile/wishlist' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/profile/wallet' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/profile/settings' },
];

// Mobile menu items
const mobileMenuItems = [
  { id: 'personal', label: 'Personal Information', icon: User, href: '/profile/settings' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/orders' },
  { id: 'addresses', label: 'Addresses', icon: MapPin, href: '/profile/addresses' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/profile/wallet' },
  { id: 'help', label: 'Help Center', icon: HelpCircle, href: '/help' },
  { id: 'seller', label: 'Switch to Seller', icon: Store, href: '/seller' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/profile/settings' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Get user email from auth context or fallback
  const userEmail = user?.email || 'olajide@example.com';
  const userName = user?.name || 'Olajide';
  const memberSince = 'Member since 2023';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif font-bold text-lg text-text-primary">My Profile</span>
        <div className="w-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Desktop Breadcrumb */}
        <nav className="hidden lg:flex items-center gap-2 text-xs text-text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-primary font-medium">My Profile</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-4 sticky top-24">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-text-muted hover:bg-secondary/30 hover:text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Account Info Card */}
            <div className="lg:hidden bg-surface border border-border rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-lg">{userName}</h2>
                  <p className="text-xs text-text-muted">{memberSince}</p>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden bg-surface border border-border rounded-2xl overflow-hidden mb-6">
              {mobileMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`flex items-center justify-between px-6 py-4 ${
                      index !== mobileMenuItems.length - 1 ? 'border-b border-border' : ''
                    } hover:bg-secondary/20 transition-colors`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-text-muted" />
                      <span className="text-text-primary font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Welcome Section */}
            <div className="hidden lg:block bg-surface border border-border rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-text-primary mb-2">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-text-muted text-sm mb-6">
                    You're logged in as <span className="text-primary font-medium">{userEmail}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-secondary text-text-primary font-medium rounded-full hover:bg-secondary/80 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Mobile Logout Button */}
            <div className="lg:hidden px-4 mb-8">
              <button
                onClick={handleLogout}
                className="w-full py-4 border-2 border-red-500 text-red-500 font-medium rounded-full hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>

            {/* Recently Viewed Section - Desktop */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-text-primary">Recently Viewed</h2>
                <Link
                  to="/shop"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {recentlyViewed.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group bg-surface border border-border rounded-2xl p-3 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20 mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                    <p className="text-sm text-primary font-bold mt-1">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats Cards - Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-4">
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary">12</span>
                </div>
                <p className="text-sm text-text-muted">Total Orders</p>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary">5</span>
                </div>
                <p className="text-sm text-text-muted">Wishlist Items</p>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary">3</span>
                </div>
                <p className="text-sm text-text-muted">Notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Recently Viewed */}
      <div className="lg:hidden px-4 pb-24">
        <h2 className="text-lg font-serif font-bold text-text-primary mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-2 gap-4">
          {recentlyViewed.slice(0, 2).map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-surface border border-border rounded-2xl p-3"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-text-primary truncate">{product.name}</p>
              <p className="text-xs text-primary font-bold mt-1">
                ₦{product.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
