/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/pages/AdminShippingPage.jsx */
import { useEffect, useState } from 'react';
import { Info, MapPin, Navigation, Pencil, Plane, Plus, Trash2, Truck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  useAdminShippingSettings,
  useAdminShippingZones,
  useDeleteShippingZone,
  useSaveShippingZone,
  useUpdateShippingSettings
} from '../../../hooks/useAdmin';

const getZoneIcon = (iconType) => {
  switch (iconType) {
    case 'map-pin':
      return <MapPin className="w-5 h-5" />;
    case 'truck':
      return <Truck className="w-5 h-5" />;
    case 'plane':
      return <Plane className="w-5 h-5" />;
    default:
      return <Navigation className="w-5 h-5" />;
  }
};

export default function AdminShippingPage() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const canManageShipping = user?.role === 'super_admin';
  const { data: zones = [], isLoading, isError } = useAdminShippingZones();
  const { data: shippingSettings } = useAdminShippingSettings();
  const saveShippingZone = useSaveShippingZone();
  const deleteShippingZone = useDeleteShippingZone();
  const updateShippingSettings = useUpdateShippingSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRulesInfoOpen, setIsRulesInfoOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    freeShippingThreshold: '50000',
    storeCountry: 'Nigeria',
    domesticDefaultShippingFee: '1500',
    internationalDefaultShippingFee: '25000'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: 'Nigeria',
    state: '',
    city: '',
    price: '',
    icon: 'map-pin',
    estimatedDays: ''
  });

  useEffect(() => {
    if (shippingSettings) {
      setSettingsForm({
        freeShippingThreshold: String(shippingSettings.freeShippingThreshold ?? 50000),
        storeCountry: shippingSettings.storeCountry || 'Nigeria',
        domesticDefaultShippingFee: String(shippingSettings.domesticDefaultShippingFee ?? shippingSettings.defaultShippingFee ?? 1500),
        internationalDefaultShippingFee: String(shippingSettings.internationalDefaultShippingFee ?? 25000)
      });
    }
  }, [shippingSettings]);

  const handleOpenModal = (zone = null) => {
    if (!canManageShipping) {
      toast.error('Only super admins can change shipping rules.');
      return;
    }
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name || '',
        description: zone.description || '',
        country: zone.country || 'Nigeria',
        state: zone.state || '',
        city: zone.city || '',
        price: String(zone.price || ''),
        icon: zone.icon || 'map-pin',
        estimatedDays: zone.estimated_days || ''
      });
    } else {
      setEditingZone(null);
      setFormData({ name: '', description: '', country: 'Nigeria', state: '', city: '', price: '', icon: 'map-pin', estimatedDays: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingZone(null);
  };

  const handleSaveZone = async () => {
    if (!canManageShipping) return;
    if (!formData.name || !formData.country || !formData.price) return;

    try {
      await saveShippingZone.mutateAsync({
        id: editingZone?.id,
        name: formData.name,
        description: formData.description,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        price: parseInt(formData.price, 10) || 0,
        icon: formData.icon,
        estimated_days: formData.estimatedDays,
        is_active: true
      });
      toast.success(editingZone ? 'Shipping zone updated' : 'Shipping zone created');
      handleCloseModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save shipping zone');
    }
  };

  const handleDeleteZone = async (id) => {
    if (!canManageShipping) return;
    const confirmed = await confirm({
      title: 'Delete Shipping Zone',
      message: 'Any address that used this zone will fall back to the next matching shipping rule.',
      confirmText: 'Delete Zone'
    });

    if (!confirmed) return;

    try {
      await deleteShippingZone.mutateAsync(id);
      toast.success('Shipping zone deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete shipping zone');
    }
  };

  const handleSaveSettings = async () => {
    if (!canManageShipping) {
      toast.error('Only super admins can change shipping rules.');
      return;
    }
    try {
      await updateShippingSettings.mutateAsync({
        freeShippingThreshold: Number(settingsForm.freeShippingThreshold || 0),
        storeCountry: settingsForm.storeCountry,
        domesticDefaultShippingFee: Number(settingsForm.domesticDefaultShippingFee || 0),
        internationalDefaultShippingFee: Number(settingsForm.internationalDefaultShippingFee || 0)
      });
      toast.success('Shipping settings saved');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save shipping settings');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Shipping Logistics</h1>
          <p className="text-gray-500 dark:text-[#888888] mt-1">Manage regional zones and delivery pricing architecture.</p>
        </div>
        {canManageShipping && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Zone
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <div className="relative inline-flex items-center gap-2">
              <h2 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Shipping Rules</h2>
              <button
                type="button"
                onClick={() => setIsRulesInfoOpen((value) => !value)}
                aria-label="Shipping rules information"
                className="p-1.5 text-gray-400 hover:text-[#FF6B8A] transition-colors rounded-full hover:bg-[#FF6B8A]/10"
              >
                <Info className="w-4 h-4" />
              </button>
              {isRulesInfoOpen && (
                <div className="absolute left-0 top-full mt-3 w-[min(22rem,calc(100vw-3rem))] z-20 rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1E1E1E] p-4 shadow-xl">
                  <p className="text-sm text-gray-600 dark:text-[#CCCCCC] leading-relaxed">
                    City zones are matched first, then state zones, then country zones, then the right default fee. Free shipping only applies when the customer country matches the store country.
                  </p>
                </div>
              )}
            </div>
          </div>
          <label className="block w-full lg:w-44">
            <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
              Store Country
            </span>
            <input
              type="text"
              value={settingsForm.storeCountry}
              onChange={(e) => setSettingsForm({ ...settingsForm, storeCountry: e.target.value })}
              disabled={!canManageShipping}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
            />
          </label>
          <label className="block w-full lg:w-56">
            <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
              Domestic Free Shipping From (₦)
            </span>
            <input
              type="number"
              min="0"
              value={settingsForm.freeShippingThreshold}
              onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: e.target.value })}
              disabled={!canManageShipping}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
            />
          </label>
          <label className="block w-full lg:w-56">
            <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
              Domestic Default (₦)
            </span>
            <input
              type="number"
              min="0"
              value={settingsForm.domesticDefaultShippingFee}
              onChange={(e) => setSettingsForm({ ...settingsForm, domesticDefaultShippingFee: e.target.value })}
              disabled={!canManageShipping}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
            />
          </label>
          <label className="block w-full lg:w-56">
            <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
              International Default (₦)
            </span>
            <input
              type="number"
              min="0"
              value={settingsForm.internationalDefaultShippingFee}
              onChange={(e) => setSettingsForm({ ...settingsForm, internationalDefaultShippingFee: e.target.value })}
              disabled={!canManageShipping}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
            />
          </label>
          {canManageShipping && (
            <button
              onClick={handleSaveSettings}
              disabled={updateShippingSettings.isPending}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
            >
              {updateShippingSettings.isPending ? 'Saving...' : 'Save Rules'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 text-center text-gray-500 dark:text-[#888888]">
            Loading shipping zones...
          </div>
        )}
        {isError && (
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 text-center text-red-500">
            Failed to load shipping zones.
          </div>
        )}
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white dark:bg-[#141414] rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6B8A]/10 rounded-xl flex items-center justify-center text-[#FF6B8A]">
                {getZoneIcon(zone.icon)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{zone.name}</h3>
                <p className="text-sm text-gray-500 dark:text-[#888888]">{zone.description}</p>
                <p className="text-xs text-gray-400 dark:text-[#777777] mt-1">
                  {[zone.city, zone.state, zone.country].filter(Boolean).join(', ') || 'No location set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400 dark:text-[#888888] uppercase tracking-wider">Standard Rate</p>
                <p className="text-xl font-semibold text-[#FF6B8A]">₦{parseFloat(zone.price).toLocaleString()}</p>
              </div>
              {canManageShipping && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(zone)}
                    className="p-2 text-gray-400 hover:text-[#FF6B8A] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && zones.length === 0 && (
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-[#FF6B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-[#FF6B8A]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No shipping zones yet</h3>
          <p className="text-gray-500 dark:text-[#888888] mb-4">Add your first shipping zone to get started</p>
          {canManageShipping && (
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Add First Zone
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                {editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Zone Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Lagos Metro"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Description</span>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Domestic Express Delivery (1-2 days)"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                />
              </label>

              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Country</span>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Nigeria"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">State</span>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Lagos"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">City</span>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ikeja"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Price (₦)</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Icon</span>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  >
                    <option value="map-pin">Map Pin</option>
                    <option value="truck">Truck</option>
                    <option value="plane">Plane</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">Estimated Delivery Days</span>
                <input
                  type="text"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                  placeholder="e.g., 1-2"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-[#2A2A2A]">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveZone}
                disabled={saveShippingZone.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
              >
                {saveShippingZone.isPending ? 'Saving...' : editingZone ? 'Save Changes' : 'Create Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
