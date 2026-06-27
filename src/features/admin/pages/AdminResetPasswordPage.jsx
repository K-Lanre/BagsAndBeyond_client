import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../lib/api';

export default function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/admin/auth/reset-password', { token, password: form.password });
      toast.success(data.message || 'Password reset successful');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not reset password');
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
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Set New Password</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Choose a new password for the admin account.</p>
          </div>

          {!token ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-red-500">This reset link is missing a token.</p>
              <Link to="/admin/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover">Request a new link</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  minLength={8}
                  required
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  minLength={8}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-70 transition-all"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
