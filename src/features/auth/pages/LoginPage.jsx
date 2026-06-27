/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/auth/pages/LoginPage.jsx */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { SocialAuthButtons } from '../components/SocialAuthButtons';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication
    if (formData.email && formData.password) {
      login({
        id: '1',
        email: formData.email,
        name: 'Guest User',
      });
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Please fill in all fields');
    }

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your account"
      heroTitle="Curating the extraordinary."
      heroSubtitle="Experience the Digital Atelier. Premium craftsmanship delivered to your doorstep."
      heroImage="/landing/Luxury Handbag.png"
      footerLink="/signup"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
    >
      {/* Mobile Back Button */}
      <div className="lg:hidden mb-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="atelier@example.com"
            className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Password
            </label>
            <Link 
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Log In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Social Auth */}
        <SocialAuthButtons isSignup={false} />
      </form>
    </AuthLayout>
  );
}
