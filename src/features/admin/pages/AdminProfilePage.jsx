import { useEffect, useState } from 'react';
import { Camera, KeyRound, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useChangeAdminPassword, useUpdateAdminProfile, useUploadAdminAvatar } from '../../../hooks/useAdmin';

export default function AdminProfilePage() {
  const { user, login } = useAuth();
  const updateProfile = useUpdateAdminProfile();
  const uploadAvatar = useUploadAdminAvatar();
  const changePassword = useChangeAdminPassword();
  const [profile, setProfile] = useState({ name: '', avatar_url: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      avatar_url: user?.avatar_url || ''
    });
  }, [user]);

  const initials = (profile.name || user?.email || 'AD').slice(0, 2).toUpperCase();

  const getAvatarSrc = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${apiBase.replace(/\/api\/?$/, '')}${url}`;
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadAvatar.mutateAsync(file);
      const nextProfile = { ...profile, avatar_url: data.avatar_url };
      setProfile(nextProfile);
      login(data.user);
      toast.success('Profile picture uploaded');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not upload profile picture');
    } finally {
      e.target.value = '';
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile.mutateAsync(profile);
      login(updated);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update profile');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Admin Profile</h1>
        <p className="text-sm text-gray-500 dark:text-[#888888] mt-1">Manage your display details and password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleProfileSave} className="bg-white dark:bg-[#141414] rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B8A] to-[#FF8E53] overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={getAvatarSrc(profile.avatar_url)} alt={profile.name || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-white text-xl">{initials}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Camera className="w-4 h-4 text-[#FF6B8A]" />
                Profile Image
              </div>
              <p className="text-sm text-gray-500 dark:text-[#888888]">Upload a JPG, PNG, or WebP image up to 3MB.</p>
              <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#F5F1ED] dark:bg-[#1E1E1E] text-gray-900 dark:text-white rounded-full text-sm font-medium cursor-pointer hover:text-[#FF6B8A] transition-colors">
                <Upload className="w-4 h-4" />
                {uploadAvatar.isPending ? 'Uploading...' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  disabled={uploadAvatar.isPending}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <label className="block">
            <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Display Name</span>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border border-transparent rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
            />
          </label>

          <div className="p-4 bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-xl">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
            <p className="text-sm text-gray-900 dark:text-white mt-1">{user?.email}</p>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <form onSubmit={handlePasswordSave} className="bg-white dark:bg-[#141414] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
            <KeyRound className="w-5 h-5 text-[#FF6B8A]" />
            Change Password
          </div>

          {[
            ['currentPassword', 'Current Password'],
            ['newPassword', 'New Password'],
            ['confirmPassword', 'Confirm New Password']
          ].map(([field, label]) => (
            <label key={field} className="block">
              <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">{label}</span>
              <input
                type="password"
                value={passwords[field]}
                onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border border-transparent rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
                minLength={field === 'currentPassword' ? undefined : 8}
                required
              />
            </label>
          ))}

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium disabled:opacity-70"
          >
            <KeyRound className="w-4 h-4" />
            {changePassword.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
