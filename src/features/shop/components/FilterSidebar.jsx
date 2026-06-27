/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/shop/components/FilterSidebar.jsx */
import { ChevronDown } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Products', count: 48 },
  { id: 'bags', name: 'Bags', count: 24 },
  { id: 'shoes', name: 'Shoes', count: 24 },
];

const subcategories = [
  { id: 'all', name: 'All' },
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'unisex', name: 'Unisex' },
];

export function FilterSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  selectedSubcategory,
  onSubcategoryChange,
  priceRange, 
  onPriceRangeChange,
  sortBy,
  onSortChange
}) {
  return (
    <aside className="w-full lg:w-56 flex-shrink-0 space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Categories
        </h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'text-primary font-medium'
                    : 'text-text-primary hover:text-primary'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  selectedCategory === category.id ? 'bg-primary' : 'bg-border'
                }`} />
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Audience
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              type="button"
              onClick={() => onSubcategoryChange?.(subcategory.id)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                selectedSubcategory === subcategory.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-text-primary hover:border-primary hover:text-primary'
              }`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="relative h-1 bg-border rounded-full">
            <div 
              className="absolute h-full bg-primary rounded-full"
              style={{ 
                left: `${(priceRange[0] / 100000) * 100}%`, 
                right: `${100 - (priceRange[1] / 100000) * 100}%` 
              }}
            />
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}+</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Sort By
        </h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full appearance-none bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="new-arrivals">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>
    </aside>
  );
}
