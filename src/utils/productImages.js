import { BASE_URL } from '../lib/api';

const FALLBACK_PRODUCT_IMAGE = '/landing/Bags Collection.png';

export function parseProductImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return images ? [images] : [];
    }
  }

  return [];
}

export function getProductImageUrl(productOrImages, index = 0) {
  const images = Array.isArray(productOrImages)
    ? productOrImages
    : parseProductImages(productOrImages?.images);

  const image = images[index];

  if (!image) return FALLBACK_PRODUCT_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith('/uploads/')) return `${BASE_URL}${image}`;
  if (image.startsWith('/landing/') || image.startsWith('/assets/')) return image;
  if (image.startsWith('/')) return image;
  if (image.includes('/')) return `${BASE_URL}/uploads/${image}`;

  const uploadFolder = image.startsWith('images-') ? 'products/' : '';
  return `${BASE_URL}/uploads/${uploadFolder}${image}`;
}
