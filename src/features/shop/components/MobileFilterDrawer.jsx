/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/shop/components/MobileFilterDrawer.jsx */
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';

export function MobileFilterDrawer({ 
  isOpen, 
  onClose, 
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl z-50 transform transition-transform duration-300 lg:hidden ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-text-muted" />
            <span className="font-medium text-text-primary">Filters</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={onSubcategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
          />
        </div>

        {/* Apply Button */}
        <div className="p-6 border-t border-border">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors"
          >
            Show Results
          </button>
        </div>

        {/* Safe area */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </>
  );
}
