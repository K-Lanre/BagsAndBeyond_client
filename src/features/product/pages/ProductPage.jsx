/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/product/pages/ProductPage.jsx */
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Truck, RefreshCw, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../../contexts/CartContext';
import { useProduct } from '../../../hooks/useProducts';
import { ImageGallery } from '../components/ImageGallery';
import { ColorSelector } from '../components/ColorSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { ProductTabs } from '../components/ProductTabs';
import { SizeGuide } from '../components/SizeGuide';
import { ReviewsSection } from '../components/ReviewsSection';
import { getProductImageUrl, parseProductImages } from '../../../utils/productImages';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-text-muted">Product not found.</p>
        <Link to="/shop" className="text-primary hover:underline">Back to Shop</Link>
      </div>
    );
  }

  // Map backend data to UI shape
  const parsedImages = parseProductImages(product.images);

  const imageUrls = parsedImages.length > 0
    ? parsedImages.map((_, index) => getProductImageUrl(parsedImages, index))
    : ['/landing/Bags Collection.png'];

  const price = parseFloat(product.price);
  const outOfStock = product.stock_quantity === 0 || product.status === 'out_of_stock';
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  const stockLabel = outOfStock ? 'OUT OF STOCK' : lowStock ? `LOW STOCK (${product.stock_quantity} left)` : 'IN STOCK';
  const stockColor = outOfStock ? 'text-red-600 bg-red-100' : lowStock ? 'text-orange-600 bg-orange-100' : 'text-green-600 bg-green-100';

  const handleAddToCart = () => {
    if (outOfStock) return;
    const cartItem = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: price,
      image: imageUrls[0],
      color: selectedColor || null,
      quantity,
    };
    addToCart(cartItem);
    toast.success(`Added ${quantity}× ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    const cartItem = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: price,
      image: imageUrls[0],
      color: selectedColor || null,
      quantity,
    };
    addToCart(cartItem);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <Link to="/shop" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <span className="font-serif font-bold text-lg text-text-primary">BagsAndBeyond</span>
        <div className="w-5" />
      </div>

      {/* Breadcrumb - Desktop */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
          <Link to="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
          <span className="text-text-muted">/</span>
          <Link to="/shop" className="text-text-muted hover:text-primary transition-colors">Shop</Link>
          <span className="text-text-muted">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Image Gallery */}
          <div>
            <ImageGallery images={imageUrls} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Badge for low stock */}
            {lowStock && (
              <span className="inline-block bg-[#E8738A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                LOW STOCK
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-text-primary">
              {product.name}
            </h1>

            {/* Price & Stock */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ₦{price.toLocaleString()}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${stockColor}`}>
                {stockLabel}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-text-muted leading-relaxed">
              {product.description || 'Premium quality product from Bags & Beyond.'}
            </p>

            {/* Color Selector — only if colors exist in future */}
            {selectedColor !== undefined && (
              <ColorSelector
                colors={[]}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                colorName={selectedColor}
              />
            )}

            {/* Quantity */}
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              max={product.stock_quantity}
            />

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="w-full py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="w-full py-4 border-2 border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Truck className="w-4 h-4 text-primary" />
                <span>Domestic free shipping from ₦50,000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>1 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Size Guide Row */}
        <div className="grid lg:grid-cols-3 gap-8 mt-12 lg:mt-16">
          <div className="lg:col-span-2">
            <ProductTabs
              description={product.description}
              details={[
                { label: 'Category', value: product.category },
                { label: 'SKU', value: product.sku },
                ...(product.weight ? [{ label: 'Weight', value: `${product.weight} kg` }] : []),
              ]}
            />
          </div>
          <div className="lg:col-span-1">
            <SizeGuide dimensions={
              product.dimensions
                ? (typeof product.dimensions === 'string' ? Object.entries(JSON.parse(product.dimensions)) : Object.entries(product.dimensions))
                    .map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), value: `${v} cm` }))
                : []
            } />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 lg:mt-16 pt-12 border-t border-border">
          <ReviewsSection averageRating={5.0} totalReviews={0} />
        </div>
      </div>

      {/* Mobile Sticky Bottom Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-50 safe-area-pb">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex-1 py-3.5 bg-primary text-white font-medium rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="flex-1 py-3.5 border-2 border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
