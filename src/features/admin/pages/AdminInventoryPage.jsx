/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/admin/pages/AdminInventoryPage.jsx */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, Package, RefreshCw, Search, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminInventorySummary, useAdminProducts } from '../../../hooks/useAdmin';
import { getProductImageUrl } from '../../../utils/productImages';

export default function AdminInventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const { data: summary, isLoading: summaryLoading } = useAdminInventorySummary();
  const { data: productsData, isLoading: productsLoading, refetch } = useAdminProducts({
    search: searchQuery || undefined,
    limit: 50
  });

  const products = productsData?.products || [];
  const criticalAlerts = summary?.criticalAlerts || [];
  const stats = summary?.stats || { totalItems: 0, totalValuation: 0, lowStockAlerts: 0 };

  const handleRefresh = async () => {
    await refetch();
    toast.success('Inventory refreshed');
  };

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const updateSearch = (value) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('search', value.trim());
    else nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  };

  const getImageUrl = (product) => {
    return getProductImageUrl(product);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Inventory & Supply</h1>
          <p className="text-gray-500 dark:text-[#888888] mt-1">Live stock visibility from your product catalog.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FFE4E9] dark:bg-[#FF6B8A]/20 text-[#FF6B8A] rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <p className="text-xs text-gray-400 dark:text-[#888888] uppercase tracking-wider">Units In Stock</p>
          <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-2">
            {summaryLoading ? '...' : stats.totalItems.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500">Catalog-backed</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <p className="text-xs text-gray-400 dark:text-[#888888] uppercase tracking-wider">Catalog Value</p>
          <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-2">
            ₦{Number(stats.totalValuation || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 dark:text-[#888888] mt-2">Based on current product prices</p>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 border-l-4 border-red-500">
          <p className="text-xs text-red-500 uppercase tracking-wider font-medium">Low Stock Alerts</p>
          <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-2">
            {summaryLoading ? '...' : stats.lowStockAlerts}
          </p>
          <p className="text-xs text-red-500 mt-2 font-medium">10 units or fewer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Critical Alerts</h2>
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">LIVE</span>
          </div>
          <div className="space-y-4">
            {criticalAlerts.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-[#888888]">No low-stock products right now.</div>
            )}
            {criticalAlerts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-[#FDF8F9] dark:bg-[#1E1E1E] rounded-xl">
                <img src={getImageUrl(product)} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100 dark:bg-[#2A2A2A]" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-[#888888]">SKU: {product.sku || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${product.stock_quantity <= 5 ? 'text-red-500' : 'text-orange-500'}`}>
                    {product.stock_quantity} units left
                  </p>
                  <p className="text-xs text-[#FF6B8A] font-medium mt-1">{product.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#141414] rounded-2xl p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2A2A2A] rounded-xl text-sm focus:outline-none focus:border-[#FF6B8A]"
            />
          </div>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Product</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider">Stock</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 dark:text-[#888888] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                {productsLoading && (
                  <tr><td colSpan="3" className="py-8 text-center text-gray-500">Loading products...</td></tr>
                )}
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(product)} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-[#2A2A2A]" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-[#888888]">{product.sku || product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.stock_quantity}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity <= 5
                          ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                          : product.stock_quantity <= 10
                            ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                            : 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                      }`}>
                        {product.stock_quantity <= 10 && <AlertTriangle className="w-3 h-3" />}
                        {product.stock_quantity <= 5 ? 'Critical' : product.stock_quantity <= 10 ? 'Low' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 dark:bg-[#0A0A0A] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-[#FF6B8A]" />
          <h2 className="text-lg font-serif font-medium">Category Stock Mix</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(summary?.categoryBreakdown || []).map((category) => (
            <div key={category.category} className="bg-white/10 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-white/60">{category.category || 'uncategorized'}</p>
              <p className="text-2xl font-serif mt-2">{parseInt(category.dataValues?.stock || category.stock || 0).toLocaleString()}</p>
              <p className="text-xs text-white/50 mt-1">{category.dataValues?.count || category.count} products</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
