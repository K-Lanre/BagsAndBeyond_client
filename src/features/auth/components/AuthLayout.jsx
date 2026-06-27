/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/auth/components/AuthLayout.jsx */
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export function AuthLayout({
  children,
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  heroImage,
  footerLink,
  footerText,
  footerLinkText
}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Hero (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-secondary/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="font-serif font-bold text-xl text-primary">
            BagsAndBeyond
          </Link>

          {/* Hero Content */}
          <div className="space-y-6">
            <p className="text-primary text-sm tracking-wider">The Digital Atelier</p>
            <h2 className="text-4xl xl:text-5xl font-serif font-bold text-text-primary leading-tight">
              {heroTitle}
            </h2>
            <p className="text-text-muted max-w-sm leading-relaxed">
              {heroSubtitle}
            </p>
          </div>

          {/* Hero Image */}
          {heroImage && (
            <div className="relative mt-8">
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative bg-white/50 dark:bg-surface/50 rounded-3xl p-4 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={heroImage}
                  alt="Luxury bag"
                  className="w-64 h-64 object-contain rounded-2xl"
                />
                <p className="text-center text-xs text-text-muted mt-3 tracking-wider uppercase">
                  Seasonal Collection
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-[10px] text-text-muted tracking-wider">
            © 2024 BAGSANDBEYOND. DESIGNED FOR THE DIGITAL ATELIER.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-secondary/20"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="font-serif font-bold text-xl text-primary italic">
              BagsAndBeyond
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary">
              {title}
            </h1>
            <p className="text-text-muted text-sm">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer Link */}
          <p className="text-center text-sm text-text-muted">
            {footerText}{' '}
            <Link
              to={footerLink}
              className="text-primary font-medium hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
