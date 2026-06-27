/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/components/AdminLayout.jsx */
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  Boxes,
  Truck,
  Tag,
  ImageIcon,
  UserCircle,
  X
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { useAdminNotifications, useClearAdminNotifications, useMarkAdminNotificationsRead } from '../../../hooks/useAdmin';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, href: '/admin/inventory' },
  { id: 'shipping', label: 'Shipping', icon: Truck, href: '/admin/shipping' },
  { id: 'coupons', label: 'Coupons', icon: Tag, href: '/admin/coupons' },
  { id: 'promos', label: 'Promos', icon: ImageIcon, href: '/admin/promos' },
  { id: 'audit', label: 'Audit', icon: ShieldCheck, href: '/admin/audit' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  { id: 'profile', label: 'Profile', icon: UserCircle, href: '/admin/profile' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const { data: notificationData } = useAdminNotifications(!isCheckingAuth);
  const markNotificationsReadMutation = useMarkAdminNotificationsRead();
  const clearNotificationsMutation = useClearAdminNotifications();

  // Get active tab based on current path
  const currentPath = location.pathname;
  const activeTab = sidebarItems.find(item => item.href === currentPath)?.id || 'dashboard';

  useEffect(() => {
    let isMounted = true;

    const verifyAdminSession = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const { data } = await api.get('/admin/auth/me');
        login(data);
      } catch (error) {
        localStorage.removeItem('adminToken');
        logout();
        navigate('/admin/login', { replace: true });
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifyAdminSession();

    return () => {
      isMounted = false;
    };
  }, [login, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAdminSearch = (e) => {
    e.preventDefault();
    const query = adminSearchQuery.trim();
    if (!query) return;

    let target = '/admin/products';
    if (currentPath.startsWith('/admin/orders')) target = '/admin/orders';
    if (currentPath.startsWith('/admin/products')) target = '/admin/products';
    if (currentPath.startsWith('/admin/inventory')) target = '/admin/inventory';
    if (currentPath.startsWith('/admin/audit')) target = '/admin/audit';

    navigate(`${target}?search=${encodeURIComponent(query)}`);
  };

  const notifications = notificationData?.notifications || [];
  const unreadCount = notificationData?.unreadCount || 0;
  const initials = (user?.name || user?.email || 'AD').slice(0, 2).toUpperCase();
  const avatarSrc = user?.avatar_url
    ? /^https?:\/\//i.test(user.avatar_url)
      ? user.avatar_url
      : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')}${user.avatar_url}`
    : '';

  const markNotificationsRead = (ids) => {
    if (ids.length === 0) return;
    markNotificationsReadMutation.mutate(ids);
  };

  const clearNotification = (id) => {
    clearNotificationsMutation.mutate([id]);
  };

  const clearAllNotifications = () => {
    const ids = notifications.map((item) => item.id);
    if (ids.length === 0) return;
    clearNotificationsMutation.mutate(ids);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen((open) => {
      const nextOpen = !open;
      if (nextOpen) {
        markNotificationsRead(notifications.map((item) => item.id));
      }
      return nextOpen;
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] flex items-center justify-center text-gray-500 dark:text-[#888888]">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#141414] border-r border-gray-200 dark:border-[#2A2A2A] z-50 transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-[#2A2A2A]">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B8A] to-[#FF8E53] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">BagsAndBeyond</h1>
              <p className="text-xs text-gray-500 dark:text-[#888888]">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white shadow-lg'
                  : 'text-gray-500 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Logout */}
        <div className="shrink-0 p-4 border-t border-gray-200 dark:border-[#2A2A2A] space-y-1 bg-white dark:bg-[#141414]">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-gray-900 dark:hover:text-white transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2A2A2A] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-[#888888] hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Search */}
              <form
                onSubmit={handleAdminSearch}
                className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-[#2A2A2A] rounded-full px-4 py-2"
              >
                <Search className="w-4 h-4 text-gray-500 dark:text-[#888888]" />
                <input
                  type="search"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Search admin..."
                  className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#888888] w-48"
                />
              </form>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleNotificationsToggle}
                  className="relative p-2 text-gray-500 dark:text-[#888888] hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#FF6B8A] text-white text-[10px] leading-5 text-center rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-[min(22rem,calc(100vw-2rem))] bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A] flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                        <p className="text-xs text-gray-500 dark:text-[#888888]">Live admin alerts</p>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAllNotifications}
                          className="text-xs font-medium text-[#FF6B8A] hover:text-[#FF8E53] transition-colors whitespace-nowrap"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-gray-500 dark:text-[#888888]">No alerts right now.</p>
                      ) : (
                        notifications.map((item) => (
                          <Link
                            key={item.id}
                            to={item.href}
                            onClick={() => {
                              markNotificationsRead([item.id]);
                              setNotificationsOpen(false);
                            }}
                            className="block px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.isRead ? 'bg-transparent' : 'bg-[#FF6B8A]'}`} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 dark:text-[#888888] mt-1 line-clamp-2">{item.message}</p>
                              </div>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  clearNotification(item.id);
                                }}
                                className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Clear notification"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link to="/admin/profile" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B8A] to-[#FF8E53] rounded-full flex items-center justify-center">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={user.name || 'Admin'} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm text-white">{initials}</span>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500 dark:text-[#888888]">{user?.email}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
