import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

export function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      onClick={() => toast("Coming Soon!", { icon: "✨" })}
      className="group flex flex-col cursor-pointer pb-2"
    >
      {/* Image Container */}
      <div className="relative bg-surface border border-border rounded-[2rem] aspect-[4/5] mb-6 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
        {product.badge && (
          <div
            className={`absolute top-5 left-5 ${product.badgeColor} text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 tracking-widest`}
          >
            {product.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-secondary/5 dark:bg-black/20 flex flex-col items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-1">
        <h3 className="text-text-primary font-medium text-lg truncate group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < product.rating ? "fill-current" : "text-gray-300 dark:text-gray-600"}`}
              />
            ))}
          </div>
          <span className="text-text-muted text-xs font-medium">
            ({product.reviews})
          </span>
        </div>
        <span className="text-primary font-bold text-xl pt-1">
          {product.price}
        </span>
      </div>
    </Link>
  );
}
