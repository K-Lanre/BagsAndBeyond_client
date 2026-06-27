/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/pages/AdminCouponsPage.jsx */
import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  TrendingUp,
  Tag,
  X,
  ChevronLeft
} from 'lucide-react';

import { 
  useAdminCoupons, 
  useCreateCoupon, 
  useUpdateCoupon, 
  useDeleteCoupon 
} from '../../../hooks/useAdmin';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate, isPastDate } from '../../../utils/date';

const discountTypes = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount (₦)' },
  { value: 'free_shipping', label: 'Free Shipping' }
];

const getStatusColor = (coupon) => {
  const isExpired = isPastDate(coupon.expiry_date);
  const isInactive = !coupon.is_active;
  const isLimited = coupon.used_count >= coupon.usage_limit;

  if (isInactive || isExpired) return 'bg-gray-100 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400';
  if (isLimited) return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
  return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
};

const getStatusLabel = (coupon) => {
  const isExpired = isPastDate(coupon.expiry_date);
  const isInactive = !coupon.is_active;
  const isLimited = coupon.used_count >= coupon.usage_limit;

  if (isInactive) return 'Inactive';
  if (isExpired) return 'Expired';
  if (isLimited) return 'Limited';
  return 'Active';
};

export default function AdminCouponsPage() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const canManageCoupons = user?.role === 'super_admin';
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_purchase: '',
    usage_limit: '',
    expiry_date: '',
    is_active: true
  });

  const handleOpenForm = (coupon = null) => {
    if (!canManageCoupons) {
      toast.error('Only super admins can manage coupons.');
      return;
    }
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        min_purchase: coupon.min_purchase.toString(),
        usage_limit: coupon.usage_limit.toString(),
        expiry_date: (coupon.expiry_date || '').split('T')[0],
        is_active: coupon.is_active
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        min_purchase: '',
        usage_limit: '100',
        expiry_date: '',
        is_active: true
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleSaveCoupon = async () => {
    if (!canManageCoupons) return;
    if (!formData.code || !formData.expiry_date) {
      toast.error('Please fill in required fields');
      return;
    }

    const payload = {
      ...formData,
      value: parseFloat(formData.value) || 0,
      min_purchase: parseFloat(formData.min_purchase) || 0,
      usage_limit: parseInt(formData.usage_limit) || 100
    };

    try {
      if (editingCoupon) {
        await updateMutation.mutateAsync({ id: editingCoupon.id, ...payload });
        toast.success('Coupon updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Coupon created');
      }
      handleCloseForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!canManageCoupons) return;
    const confirmed = await confirm({
      title: 'Delete Coupon',
      message: 'Customers will no longer be able to use this coupon after it is deleted.',
      confirmText: 'Delete Coupon'
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Coupon deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const getPreviewSavings = () => {
    if (formData.type === 'percentage') {
      return `Save ${formData.value || 0}%`;
    } else if (formData.type === 'flat') {
      return `Save ₦${parseInt(formData.value || 0).toLocaleString()}`;
    } else {
      return 'Free Delivery';
    }
  };

  const getFormattedDate = (dateStr) => {
    return formatDate(dateStr, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2">
                <span>Promotions</span>
                <ChevronLeft className="w-3 h-3 rotate-180" />
                <span className="text-[#FF6B8A]">Coupons</span>
              </div>
              <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">
                Promotional Codes
              </h1>
              <p className="text-gray-500 dark:text-[#888888] mt-1">
                Configure active marketing incentives and discounts.
              </p>
            </div>
            {canManageCoupons && (
              <button
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Create Coupon
              </button>
            )}
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-white dark:bg-[#141414] rounded-2xl p-6 relative ${
                  !coupon.is_active ? 'opacity-60' : ''
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}>
                    {getStatusLabel(coupon).toUpperCase()}
                  </span>
                  {canManageCoupons && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenForm(coupon)}
                        className="p-1.5 text-gray-400 hover:text-[#FF6B8A] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Coupon Content */}
                <div className="mb-4">
                  {coupon.type === 'percentage' && (
                    <p className="text-3xl font-serif text-[#FF6B8A]">{parseFloat(coupon.value)}% OFF</p>
                  )}
                  {coupon.type === 'flat' && (
                    <p className="text-3xl font-serif text-[#FF6B8A]">₦{parseFloat(coupon.value).toLocaleString()} Flat</p>
                  )}
                  {coupon.type === 'free_shipping' && (
                    <p className="text-3xl font-serif text-[#FF6B8A]">Free Delivery</p>
                  )}
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{coupon.code}</p>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-[#2A2A2A]">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-[#888888]">Usage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {coupon.used_count}/{coupon.usage_limit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-[#888888]">Expires</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getFormattedDate(coupon.expiry_date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && coupons.length === 0 && (
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-[#FF6B8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-[#FF6B8A]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No coupons yet</h3>
              <p className="text-gray-500 dark:text-[#888888] mb-4">Create your first promotional code</p>
              {canManageCoupons && (
                <button
                  onClick={() => handleOpenForm()}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Create Coupon
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* Create/Edit Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
              <button
                onClick={handleCloseForm}
                className="hover:text-[#FF6B8A] transition-colors"
              >
                PROMOTIONS
              </button>
              <ChevronLeft className="w-3 h-3 rotate-180" />
              <span className="text-[#FF6B8A]">{editingCoupon ? 'EDIT COUPON' : 'CREATE NEW COUPON'}</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-serif text-[#FF6B8A]">The Digital Atelier</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 italic">Bespoke Promotional Engine</p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., ATELIER-SUMMER-24"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A] uppercase"
                  />
                  <p className="text-xs text-gray-400 mt-1">Must be alphanumeric and unique</p>
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, value: '' })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  >
                    {discountTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Discount Value {formData.type === 'percentage' ? '(%)' : formData.type === 'flat' ? '(₦)' : ''}
                  </label>
                  <div className="relative">
                    {formData.type === 'flat' && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                    )}
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder={formData.type === 'percentage' ? '20' : formData.type === 'flat' ? '5000' : '0'}
                      disabled={formData.type === 'free_shipping'}
                      className={`w-full ${formData.type === 'flat' ? 'pl-8' : 'pl-4'} pr-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A] disabled:opacity-50`}
                    />
                  </div>
                </div>

                {/* Minimum Purchase */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Minimum Purchase Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="number"
                      value={formData.min_purchase}
                      onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                      placeholder="15000"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                    />
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Total redemptions allowed</p>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B8A]"
                  />
                </div>
                
                {/* Is Active */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1E1E1E] rounded-xl">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Active Status</span>
                  <button
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-[#2A2A2A]'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${formData.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-[#2A2A2A]">
                <button
                  onClick={handleCloseForm}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors uppercase text-sm tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCoupon}
                  className="px-8 py-3 bg-gradient-to-r from-[#FF6B8A] to-[#FF8E53] text-white rounded-full font-medium hover:opacity-90 transition-opacity uppercase text-sm tracking-wider"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            {/* Customer Preview Card */}
            <div className="bg-gradient-to-br from-[#2A1F1F] to-[#1A1515] rounded-2xl p-6 text-white">
              <p className="text-xs text-[#FF6B8A] uppercase tracking-wider mb-4">Customer Preview</p>
              <div className="border-l-2 border-[#FF6B8A] pl-4">
                <p className="text-lg italic text-gray-300 mb-4">
                  "Unlock your curated collection with {formData.code || 'COUPON-CODE'}"
                </p>
                <div className="mb-3">
                  <span className="text-sm text-gray-400">{getPreviewSavings()}</span>
                  {formData.type === 'flat' && (
                    <span className="text-2xl font-serif text-[#FF6B8A] ml-2">
                      ₦{parseInt(formData.value || 0).toLocaleString()}
                    </span>
                  )}
                  {formData.type === 'percentage' && (
                    <span className="text-2xl font-serif text-[#FF6B8A] ml-2">
                      {formData.value || 0}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {parseInt(formData.min_purchase || 0) > 0 ? `On orders above ₦${parseInt(formData.min_purchase).toLocaleString()} • ` : ''}
                  Expires {formData.expiry_date ? formatDate(formData.expiry_date, { month: 'short', day: 'numeric' }).toUpperCase() : 'AUG 24'}
                </p>
              </div>
            </div>

            {/* Impact Card */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#FF6B8A]" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Impact</span>
              </div>
              <p className="text-2xl font-serif text-[#FF6B8A]">+12%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Conversion</p>
            </div>

            {/* Aesthetic Card */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#FF6B8A]" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Aesthetic</span>
              </div>
              <p className="text-lg font-serif text-gray-900 dark:text-white">Luxury</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tier</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
