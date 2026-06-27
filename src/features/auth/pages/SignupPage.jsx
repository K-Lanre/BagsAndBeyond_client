/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/auth/pages/SignupPage.jsx */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { SocialAuthButtons } from '../components/SocialAuthButtons';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock registration
    login({
      id: '1',
      email: formData.email,
      name: formData.fullName,
    });
    
    toast.success('Welcome to the Atelier!');
    navigate('/');

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Join the Atelier"
      subtitle="Create an account for a faster checkout and exclusive rewards"
      heroTitle="Experience the Digital Atelier."
      heroSubtitle="Curated craftsmanship, delivered to your doorstep. Join our inner circle for priority access to limited collections."
      heroImage="/landing/Luxury Handbag.png"
      footerLink="/login"
      footerText="Already have an account?"
      footerLinkText="Log In"
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
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Evelyn Thorne"
            className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>

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
            placeholder="atelier@beyond.com"
            className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>

        {/* Password Row */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                required
                minLength={8}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Confirm
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign Up'
          )}
        </button>

        {/* Social Auth */}
        <SocialAuthButtons isSignup={true} />
      </form>
    </AuthLayout>
  );
}
