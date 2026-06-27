/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/shop/pages/ShoesPage.jsx */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ShopProductCard } from '../components/ShopProductCard';
import { Pagination } from '../components/Pagination';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { useProducts } from '../../../hooks/useProducts';

export default function ShoesPage() {
  const [selectedCategory, setSelectedCategory] = useState('shoes');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('new-arrivals');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const productsPerPage = 24;
  
  const queryParams = {
    page: currentPage,
    limit: productsPerPage,
    category: 'shoes',
    ...(selectedSubcategory !== 'all' && { subcategory: selectedSubcategory }),
    min_price: priceRange[0],
    max_price: priceRange[1],
    sort: sortBy === 'price-low' ? 'price_asc' : sortBy === 'price-high' ? 'price_desc' : 'newest'
  };

  const { data, isLoading, isError } = useProducts(queryParams);

  const products = data?.products || [];
  const totalProducts = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
          <Link to="/" className="text-text-muted hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <Link to="/shop" className="text-text-muted hover:text-primary transition-colors">
            Shop
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-primary font-medium">Shoes</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
          Premium Footwear
        </h1>
        <p className="text-text-muted text-sm max-w-xl leading-relaxed">
          Step into style with our curated collection of shoes. From elegant heels to comfortable sneakers, find the perfect pair for every occasion.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-4 bg-surface rounded-2xl border border-border">
          <p className="text-sm text-text-muted">
            Showing {products.length} of {totalProducts} products
          </p>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-text-primary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={() => setIsMobileSortOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm font-medium text-text-primary"
            >
              Sort by
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex gap-8">
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
                No shoes found matching your criteria.
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
                }`}>
                {products.map((product) => (
                  <ShopProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <MobileBottomNav />

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
    </div>
  );
}
