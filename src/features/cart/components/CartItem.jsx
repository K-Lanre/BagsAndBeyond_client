/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/cart/components/CartItem.jsx */
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getProductImageUrl } from '../../../utils/productImages';

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  const increaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-surface border border-border rounded-2xl">
      {/* Product Image */}
      <Link to={`/product/${item.id}`} className="flex-shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary/10 rounded-xl overflow-hidden">
          <img
            src={getProductImageUrl([item.image])}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = '/landing/Bags Collection.png';
            }}
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${item.id}`}>
            <h3 className="font-medium text-text-primary hover:text-primary transition-colors">
              {item.name}
            </h3>
          </Link>
          <p className="text-sm text-text-muted mt-1">
            Color: {item.color}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={decreaseQuantity}
              disabled={item.quantity <= 1}
              className="px-3 py-2 text-text-muted hover:text-primary disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm font-medium text-text-primary min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="px-3 py-2 text-text-muted hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price and Remove */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-text-primary">
              ₦{(item.price * item.quantity).toLocaleString()}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
