/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/shop/components/ShopProductCard.jsx */
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '../../../utils/productImages';

export function ShopProductCard({ product, viewMode = 'grid' }) {
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist!');
  };

  const imageUrl = product.image || getProductImageUrl(product);
    
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const outOfStock = product.stock_quantity === 0 || product.status === 'out_of_stock' || product.outOfStock;
  const rating = product.rating || 5;
  const stockLabel = outOfStock ? 'Out of stock' : product.stock_quantity > 0 && product.stock_quantity < 10 ? `${product.stock_quantity} left` : 'In stock';

  if (viewMode === 'list') {
    return (
      <Link
        to={`/product/${product.slug || product.id}`}
        className="group grid grid-cols-[7rem_1fr] sm:grid-cols-[8.5rem_1fr_auto] gap-4 items-center bg-surface border border-border rounded-2xl p-3 hover:border-primary/40 transition-colors"
      >
        <div className="relative aspect-square bg-secondary/10 rounded-xl overflow-hidden">
          {(product.badge || (product.stock_quantity > 0 && product.stock_quantity < 10)) && (
            <div className={`absolute top-2 left-2 ${product.badgeColor || 'bg-[#E8738A]'} text-white text-[9px] font-bold px-2 py-1 rounded-full z-10 tracking-wider uppercase`}>
              {product.badge || 'LOW'}
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 z-5 flex items-center justify-center">
              <span className="bg-white/90 dark:bg-surface/90 text-text-primary text-[9px] font-bold px-2 py-1 rounded-full tracking-wider uppercase">
                Sold Out
              </span>
            </div>
          )}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = '/landing/Bags Collection.png' }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <div className="flex text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-text-muted text-xs">{rating}</span>
          </div>
          <h3 className="text-text-primary font-medium text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="hidden sm:block text-xs text-text-muted mt-1 line-clamp-2">
            {product.description || product.category || 'Curated BagsAndBeyond piece'}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-text-primary font-bold text-base">
              ₦{price?.toLocaleString()}
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${outOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {stockLabel}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-3">
          <button
            onClick={handleWishlist}
            className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-primary" />
          </button>
          <span className="text-xs font-medium text-primary group-hover:underline">View details</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="group flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative bg-surface border border-border rounded-[2rem] aspect-square mb-4 overflow-hidden">
        {/* Badge */}
        {(product.badge || (product.stock_quantity > 0 && product.stock_quantity < 10)) && (
          <div className={`absolute top-4 left-4 ${product.badgeColor || 'bg-[#E8738A]'} text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 tracking-wider uppercase`}>
            {product.badge || 'LOW STOCK'}
          </div>
        )}

        {/* Wishlist Button - visible on all screens */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-surface/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-primary" />
        </button>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 z-5 flex items-center justify-center">
            <span className="bg-white/90 dark:bg-surface/90 text-text-primary text-[10px] font-bold px-4 py-2 rounded-full tracking-wider uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image */}
        <div className="absolute inset-0 bg-secondary/5 dark:bg-black/20 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = '/landing/Bags Collection.png' }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-1 px-1">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-text-muted text-xs">{rating}</span>
        </div>

        {/* Name */}
        <h3 className="text-text-primary font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <span className="text-text-primary font-bold">
          ₦{price?.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
