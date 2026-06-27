/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/auth/pages/ConfirmEmailPage.jsx */
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Email confirmed!');
    navigate('/');
    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Code resent to your email');
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="font-serif font-bold text-2xl text-primary italic">
            BagsAndBeyond
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-3xl p-8 space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold text-text-primary">
              Confirm Your Email
            </h1>
            <p className="text-sm text-text-muted">
              We've sent a 6-digit confirmation code to your email. Enter it below to verify your account.
            </p>
          </div>

          {/* Code Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-background border-2 border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-text-muted">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary font-medium hover:underline inline-flex items-center gap-1 disabled:opacity-70"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend'
                )}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Login */}
        <p className="text-center text-sm text-text-muted">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
