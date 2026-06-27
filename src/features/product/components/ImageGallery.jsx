/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/product/components/ImageGallery.jsx */
import { useState } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export function ImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleWishlist = () => {
    toast.success('Added to wishlist!');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-surface rounded-[2rem] border border-border overflow-hidden">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-surface/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5 text-primary" />
        </button>

        {/* Main Image Display */}
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 overflow-hidden transition-all ${
              selectedImage === index
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <img
              src={image}
              alt={`${productName} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
