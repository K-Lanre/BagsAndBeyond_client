import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

// Create a new order (items use `slug` not `id`)
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
  });
};

// Track orders by email — returns list with order_uuid
export const useTrackOrders = (email) => {
  return useQuery({
    queryKey: ['orders', 'track', email],
    queryFn: async () => {
      const { data } = await api.get('/orders/track', { params: { email } });
      return data;
    },
    enabled: !!email,
  });
};

// Get specific order details by UUID + email verification
export const useOrderDetails = (uuid, email) => {
  return useQuery({
    queryKey: ['order', uuid, email],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${uuid}`, { params: { email } });
      return data;
    },
    enabled: !!uuid && !!email,
  });
};

// Poll order status by UUID (no email needed)
export const useOrderStatus = (uuid, email) => {
  return useQuery({
    queryKey: ['order-status', uuid, email],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${uuid}/status`, { params: { email } });
      return data;
    },
    enabled: !!uuid && !!email,
    refetchInterval: 10000, // Poll every 10 seconds
  });
};

// Validate a coupon code
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async ({ code, subtotal }) => {
      const { data } = await api.get(`/coupons/validate/${code}`, { params: { subtotal } });
      return data;
    },
  });
};

// Calculate shipping on the server so checkout and order creation share one rule
export const useCalculateShipping = () => {
  return useMutation({
    mutationFn: async ({ subtotal, country, state, city }) => {
      const { data } = await api.post('/shipping/calculate', { subtotal, country, state, city });
      return data;
    },
  });
};

// Initialize Paystack for an order and return an authorization URL
export const useInitializePaystack = () => {
  return useMutation({
    mutationFn: async ({ order_uuid, email, callback_url }) => {
      const { data } = await api.post('/payments/paystack/initialize', { order_uuid, email, callback_url });
      return data;
    },
  });
};

// Verify a payment after returning from Paystack
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (reference) => {
      const { data } = await api.get(`/payments/verify/${reference}`);
      return data;
    },
  });
};
