/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/pages/AdminPromosPage.jsx */
import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  ChevronLeft,
  Monitor,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminPromos, useDeletePromo, useSavePromo } from '../../../hooks/useAdmin';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate, isFutureDate, isPastDate } from '../../../utils/date';

// Mock promos data
const initialPromos = [
  {
    id: 1,
    title: 'Christmas Collection',
    subtitle: 'Up to 30% off on luxury items',
    description: 'Discover our curated holiday selection. Limited time offer on exclusive artisanal pieces.',
    image: '/landing/Bags Collection.png',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    isActive: true,
    startDate: '2024-12-01',
    endDate: '2024-12-26',
    position: 'hero',
    displayOn: ['desktop', 'mobile']
  },
  {
    id: 2,
    title: 'New Year Essentials',
    subtitle: 'Refresh your wardrobe',
    description: 'Start the year in style with our premium collection. Free shipping on orders over ₦50,000.',
    image: '/landing/Bags Collection.png',
    buttonText: 'Explore',
    buttonLink: '/shop',
    isActive: false,
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    position: 'featured',
    displayOn: ['desktop']
  }
];

const positions = [
  { value: 'hero', label: 'Hero Banner (Home Top)' },
  { value: 'featured', label: 'Featured Section' },
  { value: 'popup', label: 'Popup Modal' },
  { value: 'announcement', label: 'Announcement Bar' }
];

const parseDisplayOn = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return ['desktop', 'mobile'];
  try {
    return JSON.parse(value);
  } catch (error) {
    return ['desktop', 'mobile'];
  }
};

export default function AdminPromosPage() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const canManagePromos = user?.role === 'super_admin';
  const { data: promoRows = [], isLoading, isError } = useAdminPromos();
  const savePromo = useSavePromo();
  const deletePromo = useDeletePromo();
  const promos = promoRows.map((promo) => ({
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle || '',
    description: promo.description || '',
    image: promo.image || '',
    buttonText: promo.button_text || 'Shop Now',
    buttonLink: promo.button_link || '/shop',
    isActive: promo.is_active,
    startDate: promo.start_date,
    endDate: promo.end_date,
    position: promo.position,
    displayOn: parseDisplayOn(promo.display_on)
  }));
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    startDate: '',
    endDate: '',
    position: 'hero',
    displayOn: ['desktop', 'mobile']
  });

  const handleOpenForm = (promo = null) => {
    if (!canManagePromos) {
      toast.error('Only super admins can manage promos.');
      return;
    }
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        image: promo.image,
        buttonText: promo.buttonText,
        buttonLink: promo.buttonLink,
        startDate: promo.startDate,
        endDate: promo.endDate,
        position: promo.position,
        displayOn: promo.displayOn
      });
    } else {
      setEditingPromo(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        startDate: '',
        endDate: '',
        position: 'hero',
        displayOn: ['desktop', 'mobile']
      });
    }
    setShowForm(true);
    setPreviewMode(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPromo(null);
    setPreviewMode(false);
  };

  const handleSavePromo = async () => {
    if (!canManagePromos) return;
    if (!formData.title || !formData.startDate || !formData.endDate) return;

    try {
      await savePromo.mutateAsync({
        id: editingPromo?.id,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        image: formData.image,
        button_text: formData.buttonText,
        button_link: formData.buttonLink,
        start_date: formData.startDate,
        end_date: formData.endDate,
        position: formData.position,
        display_on: formData.displayOn,
        is_active: editingPromo?.isActive ?? true
      });
      toast.success(editingPromo ? 'Promo updated' : 'Promo created');
      handleCloseForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save promo');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!canManagePromos) return;
    const confirmed = await confirm({
      title: 'Delete Promo',
      message: 'This promo will be removed from the storefront and admin promo list.',
      confirmText: 'Delete Promo'
    });

    if (!confirmed) return;

    try {
      await deletePromo.mutateAsync(id);
      toast.success('Promo deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete promo');
    }
  };

  const togglePromoStatus = async (id) => {
    if (!canManagePromos) return;
    const promo = promos.find((p) => p.id === id);
    if (!promo) return;

    try {
      await savePromo.mutateAsync({
        id,
        is_active: !promo.isActive,
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        image: promo.image,
        button_text: promo.buttonText,
        button_link: promo.buttonLink,
        start_date: promo.startDate,
        end_date: promo.endDate,
        position: promo.position,
        display_on: promo.displayOn
      });
      toast.success(!promo.isActive ? 'Promo activated' : 'Promo paused');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update promo');
    }
  };

  const toggleDisplayOn = (device) => {
    const current = formData.displayOn;
    if (current.includes(device)) {
      setFormData({ ...formData, displayOn: current.filter(d => d !== device) });
    } else {
      setFormData({ ...formData, displayOn: [...current, device] });
    }
  };

  const getPositionLabel = (value) => positions.find(p => p.value === value)?.label || value;

  const isExpired = (endDate) => isPastDate(endDate);
  const isUpcoming = (startDate) => isFutureDate(startDate);

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Promotional Banners</h1>
              <p className="text-gray-500 dark:text-[#888888] mt-1">
                Create and manage promotional banners that appear on the storefront.
              </p>
            </div>
            {canManagePromos && (
              <button
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Create Promo
              </button>
            )}
          </div>

          {/* Active Promos Section */}
          {isLoading && (
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 text-center text-gray-500 dark:text-[#888888]">
              Loading promos...
            </div>
          )}
          {isError && (
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 text-center text-red-500">
              Failed to load promos.
            </div>
          )}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Promotions</h2>
            <div className="space-y-4">
              {promos.filter(p => p.isActive && !isExpired(p.endDate)).map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-64 h-48 lg:h-auto bg-gray-100 dark:bg-[#1E1E1E] relative">
                      {promo.image ? (
                        <img
                          src={promo.image}
                          alt={promo.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                          LIVE
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-[#FF6B8A]/10 text-[#FF6B8A] rounded text-xs font-medium">
                              {getPositionLabel(promo.position)}
                            </span>
                            <div className="flex gap-1">
                              {promo.displayOn.includes('desktop') && <Monitor className="w-3 h-3 text-gray-400" />}
                              {promo.displayOn.includes('mobile') && <Smartphone className="w-3 h-3 text-gray-400" />}
                            </div>
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white">{promo.title}</h3>
                          <p className="text-sm text-[#FF6B8A] mt-1">{promo.subtitle}</p>
                          <p className="text-sm text-gray-500 dark:text-[#888888] mt-2 line-clamp-2">{promo.description}</p>
                        </div>
                        {canManagePromos && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenForm(promo)}
                              className="p-2 text-gray-400 hover:text-[#FF6B8A] transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => togglePromoStatus(promo.id)}
                              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-[#2A2A2A]">
                        <div>
                          <span className="text-xs text-gray-400 dark:text-[#888888]">Button:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{promo.buttonText}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 dark:text-[#888888]">Link:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{promo.buttonLink}</span>
                        </div>
                        <div className="ml-auto">
                          <span className="text-xs text-gray-400 dark:text-[#888888]">Until:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{formatDate(promo.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inactive/Expired Promos */}
          {promos.filter(p => !p.isActive || isExpired(p.endDate)).length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-4">
                {promos.filter(p => isExpired(p.endDate)).length > 0 ? 'Expired / Inactive' : 'Inactive'}
              </h2>
              <div className="space-y-4">
                {promos.filter(p => !p.isActive || isExpired(p.endDate)).map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden opacity-60"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-48 h-32 lg:h-auto bg-gray-100 dark:bg-[#1E1E1E] relative">
                        {promo.image ? (
                          <img
                            src={promo.image}
                            alt={promo.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isExpired(promo.endDate)
                              ? 'bg-gray-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}>
                            {isExpired(promo.endDate) ? 'EXPIRED' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{promo.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-[#888888]">{promo.subtitle}</p>
                          </div>
                          {canManagePromos && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenForm(promo)}
                                className="p-2 text-gray-400 hover:text-[#FF6B8A] transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {!isExpired(promo.endDate) && (
                                <button
                                  onClick={() => togglePromoStatus(promo.id)}
                                  className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePromo(promo.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {promos.length === 0 && (
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-[#FF6B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-[#FF6B8A]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No promos yet</h3>
              <p className="text-gray-500 dark:text-[#888888] mb-4">Create your first promotional banner</p>
              {canManagePromos && (
                <button
                  onClick={() => handleOpenForm()}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Create Promo
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* Create/Edit Form */
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-4">
            <button
              onClick={handleCloseForm}
              className="hover:text-[#FF6B8A] transition-colors"
            >
              PROMOS
            </button>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-[#FF6B8A]">{editingPromo ? 'EDIT PROMO' : 'CREATE NEW PROMO'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Promo Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Christmas Collection"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Subtitle / Hook
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., Up to 30% off on luxury items"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Detailed description of the promotion..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Banner Image
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/landing/image.png or URL"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 1920x600px for hero, 800x400px for featured</p>
                </div>

                {/* Button Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      placeholder="Shop Now"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      placeholder="/shop"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Display Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  >
                    {positions.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>

                {/* Display On */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Display On
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleDisplayOn('desktop')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        formData.displayOn.includes('desktop')
                          ? 'bg-[#FF6B8A] text-white'
                          : 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      Desktop
                    </button>
                    <button
                      onClick={() => toggleDisplayOn('mobile')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        formData.displayOn.includes('mobile')
                          ? 'bg-[#FF6B8A] text-white'
                          : 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleCloseForm}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-6 py-3 border border-[#FF6B8A] text-[#FF6B8A] rounded-full font-medium hover:bg-[#FF6B8A] hover:text-white transition-colors"
                >
                  {previewMode ? 'Hide Preview' : 'Preview'}
                </button>
                <button
                  onClick={handleSavePromo}
                  disabled={savePromo.isPending}
                  className="px-8 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  {savePromo.isPending ? 'Saving...' : editingPromo ? 'Save Changes' : 'Create Promo'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className={`space-y-4 ${previewMode ? '' : 'lg:opacity-50'}`}>
              <div className="sticky top-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Preview</p>
                
                {/* Hero Preview */}
                {formData.position === 'hero' && (
                  <div className="relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
                      <p className="text-xs text-[#FF6B8A] uppercase tracking-wider mb-2">Featured</p>
                      <h3 className="text-2xl font-serif">{formData.title || 'Your Title'}</h3>
                      <p className="text-lg text-[#FF6B8A] mt-1">{formData.subtitle || 'Your subtitle'}</p>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">{formData.description || 'Description...'}</p>
                      <button className="mt-4 px-6 py-2 bg-[#FF6B8A] text-white rounded-full text-sm font-medium w-fit">
                        {formData.buttonText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Featured/Other Preview */}
                {formData.position !== 'hero' && (
                  <div className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-gray-100 dark:bg-[#1E1E1E] relative">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{formData.title || 'Your Title'}</h3>
                      <p className="text-sm text-[#FF6B8A] mt-1">{formData.subtitle || 'Your subtitle'}</p>
                      <p className="text-xs text-gray-500 dark:text-[#888888] mt-2 line-clamp-2">{formData.description || 'Description...'}</p>
                      <button className="mt-3 px-4 py-2 bg-[#FF6B8A] text-white rounded-full text-xs font-medium">
                        {formData.buttonText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Position Badge */}
                <div className="mt-4 flex items-center justify-center">
                  <span className="px-3 py-1 bg-[#FF6B8A]/10 text-[#FF6B8A] rounded-full text-xs font-medium">
                    {getPositionLabel(formData.position)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
