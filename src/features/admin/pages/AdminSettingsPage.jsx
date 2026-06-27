/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/pages/AdminSettingsPage.jsx */
import { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, MoreVertical, Plus, Shield, Store, Truck, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useAdminSettings, useCreateAdminUser, useUpdateStoreSettings } from '../../../hooks/useAdmin';

const fallbackStore = {
  name: 'BagsAndBeyond',
  email: 'support@bagsandbeyond.com',
  description: 'A curated collection of bags, shoes, and fashion essentials.',
  maintenanceMode: false
};

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const canManageSettings = user?.role === 'super_admin';
  const { data, isLoading, isError } = useAdminSettings();
  const updateStoreSettings = useUpdateStoreSettings();
  const createAdminUser = useCreateAdminUser();
  const [settings, setSettings] = useState(fallbackStore);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => {
    if (data?.store) setSettings(data.store);
  }, [data]);

  const handleSaveSettings = async () => {
    if (!canManageSettings) {
      toast.error('Only super admins can change store settings');
      return;
    }

    try {
      await updateStoreSettings.mutateAsync(settings);
      toast.success('Store settings saved');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save settings');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await createAdminUser.mutateAsync(newAdmin);
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      toast.success('Admin user created');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not create admin user');
    }
  };

  const paystack = data?.paystack || {};
  const shippingZones = data?.shippingZones || [];
  const teamMembers = data?.teamMembers || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Settings</h1>
        {isLoading && <p className="text-sm text-gray-500 dark:text-[#888888] mt-1">Loading live configuration...</p>}
        {isError && <p className="text-sm text-red-500 mt-1">Failed to load live configuration.</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-serif text-[#FF6B8A] mb-2">Store Identity</h2>
          <p className="text-sm text-gray-500 dark:text-[#888888]">
            Public storefront identity and guest checkout presentation.
          </p>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Store Name</span>
              <input
                type="text"
                value={settings.name || ''}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                disabled={!canManageSettings}
                className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border-none rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Support Email</span>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                disabled={!canManageSettings}
                className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border-none rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
              />
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Store Description</span>
            <textarea
              value={settings.description || ''}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              disabled={!canManageSettings}
              rows={3}
              className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border-none rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
            />
          </label>
          <div className="flex items-center justify-between p-4 bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
              <p className="text-xs text-gray-500 dark:text-[#888888]">Reserved for storefront gating in a later release.</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              disabled={!canManageSettings}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-[#FF6B8A]' : 'bg-gray-300 dark:bg-[#2A2A2A]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-serif text-[#FF6B8A] mb-2">Payment Systems</h2>
          <p className="text-sm text-gray-500 dark:text-[#888888]">
            Paystack keys are read from server environment variables, not stored in the browser.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#FFE4E9] dark:bg-[#FF6B8A]/10 rounded-full">
            <Shield className="w-4 h-4 text-[#FF6B8A]" />
            <span className="text-xs text-[#FF6B8A] font-medium">Secure server-side configuration</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#FF6B8A]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Paystack Configuration</p>
                <p className={paystack.active ? 'text-xs text-green-500' : 'text-xs text-yellow-500'}>
                  {paystack.active ? 'Active Integration' : 'Not configured'}
                </p>
              </div>
            </div>
            <div className={`relative w-12 h-6 rounded-full ${paystack.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-[#2A2A2A]'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full ${paystack.active ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Public Key</p>
              <p className="text-sm text-gray-900 dark:text-white mt-2">{paystack.publicKey ? 'Configured' : 'Missing'}</p>
            </div>
            <div className="p-4 bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Secret Key</p>
              <p className="text-sm text-gray-900 dark:text-white mt-2">{paystack.secretKey ? 'Configured' : 'Missing'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle2 className={`w-4 h-4 ${paystack.webhooks ? 'text-[#FF6B8A]' : 'text-gray-400'}`} />
              Webhooks {paystack.webhooks ? 'enabled' : 'inactive'}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {paystack.sandbox ? 'Sandbox mode' : 'Live mode'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-serif text-[#FF6B8A] mb-2">Shipping Logistics</h2>
          <p className="text-sm text-gray-500 dark:text-[#888888]">
            Live zones from the shipping module.
          </p>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Active Shipping Zones</h3>
            <span className="flex items-center gap-1 px-3 py-1.5 border border-[#FF6B8A] text-[#FF6B8A] rounded-full text-xs font-medium">
              <Plus className="w-3 h-3" />
              {shippingZones.length} zones
            </span>
          </div>
          <div className="space-y-3">
            {shippingZones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-4 bg-[#F5F1ED] dark:bg-[#1E1E1E] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-[#141414] rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#FF6B8A]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{zone.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#888888]">{zone.description}</p>
                  </div>
                </div>
                <span className="font-medium text-[#FF6B8A]">₦{parseFloat(zone.price).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-serif text-[#FF6B8A] mb-2">Access Control</h2>
          <p className="text-sm text-gray-500 dark:text-[#888888]">
            Admin users currently registered in the system. Only super admins can create new admins.
          </p>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FF6B8A]" />
            <h3 className="font-medium text-gray-900 dark:text-white">Team Members</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{member.name || member.email}</p>
                      <p className="text-xs text-gray-500 dark:text-[#888888]">{member.email}</p>
                      {!member.is_active && <p className="text-xs text-red-500">Inactive</p>}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#FF6B8A]/10 text-[#FF6B8A]">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {user?.role === 'super_admin' && (
            <form onSubmit={handleCreateAdmin} className="pt-6 border-t border-gray-100 dark:border-[#2A2A2A] space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Create Admin</h4>
                <p className="text-xs text-gray-500 dark:text-[#888888] mt-1">Give trusted team members dashboard access.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Display name"
                  className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border border-transparent rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
                />
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border border-transparent rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
                  required
                />
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Temporary password"
                  minLength={8}
                  className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border border-transparent rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
                  required
                />
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F1ED] dark:bg-[#1E1E1E] border border-transparent rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={createAdminUser.isPending}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium disabled:opacity-70"
              >
                <Plus className="w-4 h-4" />
                {createAdminUser.isPending ? 'Creating...' : 'Create Admin'}
              </button>
            </form>
          )}
        </div>
      </div>

      {canManageSettings && (
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-[#2A2A2A]">
          <button
            onClick={() => setSettings(data?.store || fallbackStore)}
            className="px-6 py-3 border border-gray-200 dark:border-[#2A2A2A] rounded-full text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={updateStoreSettings.isPending}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
          >
            {updateStoreSettings.isPending ? 'Saving...' : 'Save Store Configuration'}
          </button>
        </div>
      )}
    </div>
  );
}
