import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const updateProductInAdminCaches = (queryClient, updatedProduct) => {
  if (!updatedProduct?.id) return;

  queryClient.setQueriesData({ queryKey: ['admin', 'products'] }, (oldData) => {
    if (!oldData?.products) return oldData;

    return {
      ...oldData,
      products: oldData.products.map((product) => (
        product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
      ))
    };
  });
};

const invalidateProductDependentAdminQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'inventory-summary'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
};

// Fetch dashboard summary stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/stats');
      return data;
    },
    refetchInterval: 15000,
  });
};

// Fetch sales chart data
export const useAdminSalesChart = (period = 'month') => {
  return useQuery({
    queryKey: ['admin', 'sales-chart', period],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/sales-chart', { params: { period } });
      return data;
    },
  });
};

// Fetch inventory status (low stock alerts)
export const useAdminInventory = () => {
  return useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: async () => {
      const { data } = await api.get('/admin/inventory/low-stock');
      return data;
    },
  });
};

// Fetch all orders with filtering and pagination
export const useAdminOrders = (filters = {}) => {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders', { params: filters });
      return data;
    },
    refetchInterval: 15000,
  });
};

// Fetch specific order detail as admin
export const useAdminOrderDetail = (uuid) => {
  return useQuery({
    queryKey: ['admin', 'order', uuid],
    queryFn: async () => {
      const { data } = await api.get(`/admin/orders/${uuid}`);
      return data;
    },
    enabled: !!uuid,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, status }) => {
      const { data } = await api.put(`/admin/orders/${uuid}/status`, { status });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.uuid] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

// Fetch all products as admin
export const useAdminProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/products', { params: filters });
      return data;
    },
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: () => {
      invalidateProductDependentAdminQueries(queryClient);
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, formData }) => {
      const { data } = await api.patch(`/admin/products/${slug}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: (data, variables) => {
      updateProductInAdminCaches(queryClient, data.product);
      invalidateProductDependentAdminQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ['product', variables.slug] });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slug) => {
      const { data } = await api.delete(`/admin/products/${slug}`);
      return data;
    },
    onSuccess: () => {
      invalidateProductDependentAdminQueries(queryClient);
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, status }) => {
      const { data } = await api.patch(`/admin/products/${slug}/status`, { status });
      return data;
    },
    onSuccess: (data, variables) => {
      updateProductInAdminCaches(queryClient, data.product);
      invalidateProductDependentAdminQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ['product', variables.slug] });
    },
  });
};

// Fetch recent orders
export const useAdminRecentOrders = (limit = 5) => {
  return useQuery({
    queryKey: ['admin', 'orders', 'recent', limit],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders', { params: { limit, page: 1 } });
      return data;
    },
    refetchInterval: 15000,
  });
};

// Fetch audit logs as admin
export const useAdminAuditLogs = (filters = {}) => {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/audit-logs', { params: filters });
      return data;
    },
    refetchInterval: 15000,
  });
};

// --- Coupons ---

export const useAdminCoupons = () => {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const { data } = await api.get('/admin/coupons');
      return data;
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (couponData) => {
      const { data } = await api.post('/admin/coupons', couponData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...couponData }) => {
      const { data } = await api.put(`/admin/coupons/${id}`, couponData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admin/coupons/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};

// --- Shipping zones ---

export const useAdminShippingZones = () => {
  return useQuery({
    queryKey: ['admin', 'shipping-zones'],
    queryFn: async () => {
      const { data } = await api.get('/admin/shipping-zones');
      return data;
    },
  });
};

export const useSaveShippingZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...zoneData }) => {
      const { data } = id
        ? await api.put(`/admin/shipping-zones/${id}`, zoneData)
        : await api.post('/admin/shipping-zones', zoneData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-zones'] }),
  });
};

export const useDeleteShippingZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admin/shipping-zones/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-zones'] }),
  });
};

export const useAdminShippingSettings = () => {
  return useQuery({
    queryKey: ['admin', 'shipping-settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/shipping-settings');
      return data;
    },
  });
};

export const useUpdateShippingSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      const { data } = await api.put('/admin/shipping-settings', settings);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-settings'] });
    },
  });
};

// --- Promos ---

export const useAdminPromos = () => {
  return useQuery({
    queryKey: ['admin', 'promos'],
    queryFn: async () => {
      const { data } = await api.get('/admin/promos');
      return data;
    },
  });
};

export const useSavePromo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...promoData }) => {
      const { data } = id
        ? await api.put(`/admin/promos/${id}`, promoData)
        : await api.post('/admin/promos', promoData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'promos'] }),
  });
};

export const useDeletePromo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admin/promos/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'promos'] }),
  });
};

// --- Settings / inventory summary ---

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings');
      return data;
    },
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storeSettings) => {
      const { data } = await api.put('/admin/settings/store', storeSettings);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  });
};

export const useAdminInventorySummary = () => {
  return useQuery({
    queryKey: ['admin', 'inventory-summary'],
    queryFn: async () => {
      const { data } = await api.get('/admin/inventory/summary');
      return data;
    },
    refetchInterval: 15000,
  });
};

export const useAdminNotifications = (enabled = true) => {
  return useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: async () => {
      const { data } = await api.get('/admin/notifications');
      return data;
    },
    enabled,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });
};

export const useMarkAdminNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keys) => {
      const { data } = await api.put('/admin/notifications/read', { keys });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] }),
  });
};

export const useClearAdminNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keys) => {
      const { data } = await api.put('/admin/notifications/clear', { keys });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] }),
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile) => {
      const { data } = await api.put('/admin/auth/profile', profile);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
};

export const useUploadAdminAvatar = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/admin/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
  });
};

export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: async (passwords) => {
      const { data } = await api.put('/admin/auth/password', passwords);
      return data;
    },
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (adminUser) => {
      const { data } = await api.post('/admin/settings/admin-users', adminUser);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
};
