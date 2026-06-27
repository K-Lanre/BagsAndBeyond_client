/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/product/components/QuantitySelector.jsx */
import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({ quantity, onQuantityChange, maxQuantity = 10 }) {
  const decrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
        Quantity
      </span>
      <div className="flex items-center">
        <button
          onClick={decrease}
          disabled={quantity <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-l-lg border border-border bg-surface text-text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-14 h-10 flex items-center justify-center border-y border-border bg-surface text-text-primary font-medium">
          {quantity}
        </div>
        <button
          onClick={increase}
          disabled={quantity >= maxQuantity}
          className="w-10 h-10 flex items-center justify-center rounded-r-lg border border-border bg-surface text-text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
