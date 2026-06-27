/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/App.jsx */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { Layout } from './features/core/components/Layout';
import { ScrollToTop } from './features/core/components/ScrollToTop';
import HomePage from './features/home/pages/HomePage';
import ShopPage from './features/shop/pages/ShopPage';
import ShoesPage from './features/shop/pages/ShoesPage';
import BagsPage from './features/shop/pages/BagsPage';
import ProductPage from './features/product/pages/ProductPage';
import ContactPage from './features/core/pages/ContactPage';
import FAQPage from './features/core/pages/FAQPage';
import TermsPage from './features/core/pages/TermsPage';
import PrivacyPage from './features/core/pages/PrivacyPage';
import AboutPage from './features/core/pages/AboutPage';
import ShippingPage from './features/core/pages/ShippingPage';
import ReturnsPage from './features/core/pages/ReturnsPage';
import NotFoundPage from './features/core/pages/NotFoundPage';
import CartPage from './features/cart/pages/CartPage';
import CheckoutPage from './features/checkout/pages/CheckoutPage';
import OrderSuccessPage from './features/orders/pages/OrderSuccessPage';
import TrackOrderPage from './features/orders/pages/TrackOrderPage';
import OrderDetailPage from './features/orders/pages/OrderDetailPage';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminLayout from './features/admin/components/AdminLayout';
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import AdminForgotPasswordPage from './features/admin/pages/AdminForgotPasswordPage';
import AdminResetPasswordPage from './features/admin/pages/AdminResetPasswordPage';
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage';
import AdminOrderDetailPage from './features/admin/pages/AdminOrderDetailPage';
import AdminProductsPage from './features/admin/pages/AdminProductsPage';
import AdminProductDetailPage from './features/admin/pages/AdminProductDetailPage';
import AdminInventoryPage from './features/admin/pages/AdminInventoryPage';
import AdminAuditPage from './features/admin/pages/AdminAuditPage';
import AdminSettingsPage from './features/admin/pages/AdminSettingsPage';
import AdminShippingPage from './features/admin/pages/AdminShippingPage';
import AdminCouponsPage from './features/admin/pages/AdminCouponsPage';
import AdminPromosPage from './features/admin/pages/AdminPromosPage';
import AdminProfilePage from './features/admin/pages/AdminProfilePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Toaster position="top-center" />
              <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="shop/shoes" element={<ShoesPage />} />
                <Route path="shop/bags" element={<BagsPage />} />
                <Route path="product/:slug" element={<ProductPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="shipping" element={<ShippingPage />} />
                <Route path="returns" element={<ReturnsPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="payment" element={<Navigate to="/checkout" replace />} />
                <Route path="order-success" element={<OrderSuccessPage />} />
                <Route path="order-confirmation" element={<Navigate to="/track-order" replace />} />
                <Route path="track-order" element={<TrackOrderPage />} />
                <Route path="orders/:uuid" element={<OrderDetailPage />} />
                <Route path="orders" element={<Navigate to="/track-order" replace />} />
                <Route path="login" element={<Navigate to="/track-order" replace />} />
                <Route path="signup" element={<Navigate to="/track-order" replace />} />
                <Route path="profile" element={<Navigate to="/track-order" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              {/* Admin routes - with AdminLayout */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
              <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:uuid" element={<AdminOrderDetailPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/:id" element={<AdminProductDetailPage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="shipping" element={<AdminShippingPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="promos" element={<AdminPromosPage />} />
                <Route path="audit" element={<AdminAuditPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="*" element={<NotFoundPage admin />} />
              </Route>
              </Routes>
            </BrowserRouter>
          </ConfirmProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
