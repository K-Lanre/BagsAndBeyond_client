import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Eye,
  Trash2,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAdminProducts, useDeleteProduct, useAdminStats } from '../../../hooks/useAdmin';
import { useCategories } from '../../../hooks/useProducts';
import { getProductImageUrl } from '../../../utils/productImages';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const statusStyles = {
  active: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase',
  low_stock: 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase',
  out_of_stock: 'bg-red-100 dark:bg-red-500/10 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase'
};

export default function AdminProductsPage() {
  const { user } = useAuth();
  const canDeleteProducts = user?.role === 'super_admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data: stats } = useAdminStats();
  const { data: categories } = useCategories();
  const confirm = useConfirm();
  const { data, isLoading, isError } = useAdminProducts({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    page,
    limit: 10
  });

  const deleteMutation = useDeleteProduct();

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  const updateSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('search', value.trim());
    else nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  };

  const handleDelete = async (slug) => {
    const confirmed = await confirm({
      title: 'Delete Product',
      message: 'This will deactivate the product and remove it from the customer storefront.',
      confirmText: 'Delete Product'
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(slug);
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete product');
    }
  };

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.totalItems || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-text-muted mb-2">
            <span className="uppercase tracking-widest">Catalog</span>
            <span>/</span>
            <span className="text-primary uppercase tracking-widest font-bold">Products</span>
          </div>
          {/* Title & Subtitle */}
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-1">Master Inventory</h1>
          <p className="text-sm text-text-muted max-w-2xl">Oversee your curated collections. Manage stock levels and product visibility across all atelier storefronts.</p>
        </div>
        {/* Add Product Button */}
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all shadow-md sm:self-start"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Total SKU</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{stats?.total_products || 0}</span>
            <span className="text-[10px] font-bold text-green-500 uppercase">+12%</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Low Stock</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">{stats?.out_of_stock || 0}</span>
            <span className="text-[10px] font-bold text-text-muted uppercase">Critical</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Categories</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{categories?.length || 0}</span>
            <span className="text-[10px] font-bold text-text-muted uppercase">Active</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">In Stock</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{(stats?.total_products || 0) - (stats?.out_of_stock || 0)}</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Healthy</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search product registry by name, SKU or slug..."
            value={searchQuery}
            onChange={(e) => updateSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder-text-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="flex-1 lg:flex-none bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
              </option>
            ))}
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-text-primary hover:border-primary/50 transition-all shadow-sm">
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm font-medium">Newest First</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-muted">Scanning registry...</p>
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary">Connection Lost</h3>
            <p className="text-text-muted">Unable to retrieve product catalog.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary">No matching products</h3>
            <p className="text-text-muted">Your search criteria returned zero results.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Product Detail</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Category</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Price</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Stock</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/50 rounded-xl flex-shrink-0 overflow-hidden border border-border">
                            <img
                              src={getProductImageUrl(product)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{product.name}</h3>
                            <p className="text-[10px] text-text-muted font-bold uppercase">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-text-muted uppercase">{product.category}</td>
                      <td className="py-4 px-6 text-sm font-bold text-text-primary">₦{parseFloat(product.price).toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm font-bold text-text-primary">{product.stock_quantity}</td>
                      <td className="py-4 px-6">
                        <span className={statusStyles[product.stock_quantity === 0 ? 'out_of_stock' : product.stock_quantity < 10 ? 'low_stock' : 'active']}>
                          {product.stock_quantity === 0 ? 'Out of Stock' : product.stock_quantity < 10 ? 'Low Stock' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product.slug}`}
                            className="p-2 bg-surface border border-border rounded-lg hover:border-primary/50 text-text-muted hover:text-primary transition-all shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {canDeleteProducts && (
                            <button 
                              onClick={() => handleDelete(product.slug)}
                              className="p-2 bg-surface border border-border rounded-lg hover:border-red-500/50 text-text-muted hover:text-red-500 transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/10">
              <p className="text-xs text-text-muted">
                Showing <span className="font-bold text-text-primary">{(page - 1) * 10 + 1}-{Math.min(page * 10, totalProducts)}</span> of <span className="font-bold text-text-primary">{totalProducts}</span> items
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-30 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-text-primary" />
                </button>
                <div className="flex items-center gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          page === i + 1 ? 'bg-primary text-white' : 'hover:bg-surface text-text-muted'
                        }`}
                      >
                        {i + 1}
                      </button>
                   ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-30 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-text-primary" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Recommendation */}
      <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-3">Inventory Insight</p>
          <h3 className="text-xl font-serif text-text-primary mb-2 italic">Automated forecasting suggests restocking fast-moving segments.</h3>
          <p className="text-sm text-text-muted mb-4 max-w-xl">Based on last week's sales volume, we recommend increasing stock for bags in the "Premium" category to avoid missed opportunities.</p>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase text-primary hover:gap-2 transition-all"
          >
            Review Full Analysis
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
