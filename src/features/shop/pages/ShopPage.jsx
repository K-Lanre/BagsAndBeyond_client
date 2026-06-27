/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/shop/pages/ShopPage.jsx */
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, ChevronDown, Loader2, Search } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ShopProductCard } from '../components/ShopProductCard';
import { Pagination } from '../components/Pagination';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { useProducts } from '../../../hooks/useProducts';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('new-arrivals');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const productsPerPage = 24;
  
  const queryParams = {
    page: currentPage,
    limit: productsPerPage,
    ...(selectedCategory !== 'all' && { category: selectedCategory }),
    ...(selectedSubcategory !== 'all' && { subcategory: selectedSubcategory }),
    ...(searchParams.get('search') && { search: searchParams.get('search') }),
    min_price: priceRange[0],
    max_price: priceRange[1],
    // Map UI sort options to API format
    sort: sortBy === 'price-low' ? 'price_asc' : sortBy === 'price-high' ? 'price_desc' : 'newest'
  };

  const { data, isLoading, isError } = useProducts(queryParams);

  const products = data?.products || [];
  const totalProducts = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;
  const activeSearch = searchParams.get('search') || '';
  const visibleStart = totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const visibleEnd = Math.min(currentPage * productsPerPage, totalProducts);

  useEffect(() => {
    setSearchQuery(activeSearch);
    setCurrentPage(1);
  }, [activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    const query = searchQuery.trim();
    if (query) nextParams.set('search', query);
    else nextParams.delete('search');
    setCurrentPage(1);
    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    setCurrentPage(1);
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
          <Link to="/" className="text-text-muted hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-primary font-medium">Shop All</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
          Curated Collection
        </h1>
        <p className="text-text-muted text-sm max-w-xl leading-relaxed">
          Discover timeless pieces crafted with precision. From everyday essentials to statement luxury, find the accessory that moves with you.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-4 bg-surface rounded-2xl border border-border">
          {/* Results count */}
          <p className="text-sm text-text-muted">
            Showing {visibleStart}-{visibleEnd} of {totalProducts} products
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* View Toggle - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-text-primary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Mobile Sort Button */}
            <button
              onClick={() => setIsMobileSortOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm font-medium text-text-primary"
            >
              Sort by
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, SKU, category..."
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="submit" className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-medium">
            Search
          </button>
          {activeSearch && (
            <button type="button" onClick={clearSearch} className="px-5 py-3 border border-border rounded-xl text-sm text-text-primary hover:border-primary/50">
              Clear
            </button>
          )}
        </form>

        {/* Content Grid */}
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={setSelectedSubcategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-20 text-red-500">
                Failed to load products. Please try again.
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-text-muted">
                No products found matching your criteria.
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ShopProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={setSelectedSubcategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Mobile Sort Drawer */}
      <MobileSortDrawer
        isOpen={isMobileSortOpen}
        onClose={() => setIsMobileSortOpen(false)}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
}

// Mobile Sort Drawer Component
function MobileSortDrawer({ isOpen, onClose, sortBy, onSortChange }) {
  const sortOptions = [
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

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
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-medium text-text-primary">Sort By</h3>
        </div>

        {/* Options */}
        <div className="p-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                onClose();
              }}
              className={`w-full text-left px-4 py-4 rounded-xl text-sm transition-colors ${
                sortBy === option.value 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-text-primary hover:bg-secondary/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Safe area */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </>
  );
}
