import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../lib/api';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetLink('');

    try {
      const { data } = await api.post('/admin/auth/forgot-password', { email });
      toast.success(data.message || 'Password reset instructions sent');
      if (data.resetLink) setResetLink(data.resetLink);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not start password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#141414] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Reset Admin Password</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter the admin email address to receive a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bagsandbeyond.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-70 transition-all"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {resetLink && (
            <div className="mt-5 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 text-sm text-yellow-800 dark:text-yellow-200 break-all">
              SMTP is not configured, so use this local reset link for testing: {resetLink}
            </div>
          )}

          <Link to="/admin/login" className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to admin login
          </Link>
        </div>
      </div>
    </div>
  );
}
