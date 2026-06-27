import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

// Fetch paginated list of products
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// Fetch single product by SLUG (e.g. "classic-leather-tote")
export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

// Fetch categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });
};
