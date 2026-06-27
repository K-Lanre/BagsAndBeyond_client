import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Edit,
  Eye,
  Package,
  Save,
  Trash2,
  Upload,
  Plus,
  Minus,
  Camera,
  Sparkles,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { useProduct, useCategories } from '../../../hooks/useProducts';
import { useCreateProduct, useUpdateProduct } from '../../../hooks/useAdmin';
import { getProductImageUrl, parseProductImages } from '../../../utils/productImages';
import toast from 'react-hot-toast';

const fieldClassName = 'w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';
const compactFieldClassName = 'w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

export default function AdminProductDetailPage() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const isCreateMode = slug === 'new';
  const fileInputRef = useRef(null);

  const { data: categories } = useCategories();
  const { data: existingProduct, isLoading, isError } = useProduct(isCreateMode ? null : slug);
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [isEditing, setIsEditing] = useState(isCreateMode);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: 'bags',
    subcategory: 'unisex',
    status: 'active',
    weight: '',
    dimensions: { length: '', width: '', height: '' }
  });

  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (existingProduct && !isCreateMode) {
      const parsedDimensions = (() => {
        if (!existingProduct.dimensions) return {};
        if (typeof existingProduct.dimensions === 'object') return existingProduct.dimensions;
        try {
          const parsed = JSON.parse(existingProduct.dimensions);
          return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
          return {};
        }
      })();

      setFormData({
        name: existingProduct.name || '',
        sku: existingProduct.sku || '',
        description: existingProduct.description || '',
        price: existingProduct.price || '',
        stock_quantity: existingProduct.stock_quantity || '',
        category: existingProduct.category || 'bags',
        subcategory: existingProduct.subcategory || 'unisex',
        status: existingProduct.status || 'active',
        weight: existingProduct.weight || '',
        dimensions: {
          length: parsedDimensions.length || '',
          width: parsedDimensions.width || '',
          height: parsedDimensions.height || ''
        }
      });
      setPreviewImages(
        parseProductImages(existingProduct.images)
      );
    }
  }, [existingProduct, isCreateMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('dim_')) {
      const field = name.replace('dim_', '');
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...urls]);
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      const imgName = previewImages[index];
      setImagesToRemove(prev => [...prev, imgName]);
    } else {
      // Find index in newImages
      const existingCount = (existingProduct?.images || []).length - imagesToRemove.length;
      const newIdx = index - existingCount;
      setNewImages(prev => prev.filter((_, i) => i !== newIdx));
    }
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIdx >= index) setSelectedImageIdx(Math.max(0, selectedImageIdx - 1));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'dimensions') {
        data.append(key, JSON.stringify({
          length: formData.dimensions?.length || '',
          width: formData.dimensions?.width || '',
          height: formData.dimensions?.height || ''
        }));
      } else {
        data.append(key, formData[key]);
      }
    });

    newImages.forEach(file => data.append('images', file));
    if (imagesToRemove.length > 0) {
      data.append('remove_images', JSON.stringify(imagesToRemove));
    }

    try {
      if (isCreateMode) {
        await createMutation.mutateAsync(data);
        toast.success('Product created');
      } else {
        await updateMutation.mutateAsync({ slug, formData: data });
        toast.success('Product updated');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save product');
    }
  };

  if (isLoading && !isCreateMode) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-text-muted animate-pulse">Retrieving product specs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-text-muted mb-2">
            <span className="uppercase tracking-widest">Catalog</span>
            <span>/</span>
            <Link to="/admin/products" className="hover:text-primary uppercase tracking-widest font-bold">Products</Link>
            <span>/</span>
            <span className="text-primary uppercase tracking-widest font-bold">{isCreateMode ? 'New' : slug}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            {isCreateMode ? 'Create Product' : (isEditing ? 'Edit Product' : formData.name)}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => isCreateMode ? navigate('/admin/products') : setIsEditing(false)}
                className="px-6 py-2.5 border border-border rounded-full text-text-primary font-bold hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isCreateMode ? 'Create Product' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Product
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Gallery */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-serif font-bold text-text-primary">Product Images</h2>
               {isEditing && (
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-primary uppercase hover:underline flex items-center gap-1"
                 >
                    <Plus className="w-3 h-3" /> Add Media
                 </button>
               )}
               <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-4 aspect-square bg-secondary/30 rounded-2xl flex items-center justify-center overflow-hidden border border-border relative group">
                {Array.isArray(previewImages) && previewImages.length > 0 ? (
                  <img
                    src={previewImages[selectedImageIdx]?.startsWith('blob:') ? previewImages[selectedImageIdx] : getProductImageUrl(previewImages, selectedImageIdx)}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-text-muted/20 mx-auto mb-2" />
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">No images uploaded</p>
                  </div>
                )}
                {isEditing && previewImages.length > 0 && (
                   <button 
                    onClick={() => removeImage(selectedImageIdx, !previewImages[selectedImageIdx].startsWith('blob:'))}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X className="w-4 h-4" />
                   </button>
                )}
              </div>
              <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0">
                {Array.isArray(previewImages) && previewImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-full md:h-auto md:aspect-square bg-secondary/50 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIdx === i ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img
                      src={img?.startsWith('blob:') ? img : getProductImageUrl(previewImages, i)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
               <Sparkles className="w-5 h-5 text-primary" />
               <h2 className="text-lg font-serif font-bold text-text-primary">Product Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Product Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Midnight Suede Crossbody"
                    className={fieldClassName}
                  />
                ) : (
                  <p className="text-xl font-bold text-text-primary">{formData.name || 'Untitled Product'}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Description</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Describe product materials, features, fit, use cases, and care notes."
                    className={`${fieldClassName} resize-none`}
                  />
                ) : (
                  <p className="text-sm text-text-muted leading-relaxed italic border-l-2 border-primary/20 pl-4 py-2">
                    {formData.description || 'No description provided.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Attributes */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-border pb-2">Catalog Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">SKU</label>
                <p className="text-sm font-bold text-text-primary">
                  {formData.sku || (isCreateMode ? 'Auto-generated after save' : 'Not assigned')}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Category</label>
                {isEditing ? (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={compactFieldClassName}
                  >
                    {categories?.map(cat => (
                      <option key={cat.category} value={cat.category}>
                        {cat.category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-bold text-text-primary uppercase tracking-tighter">{formData.category}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Subcategory</label>
                {isEditing ? (
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className={compactFieldClassName}
                  >
                    <option value="men">MEN</option>
                    <option value="women">WOMEN</option>
                    <option value="unisex">UNISEX</option>
                  </select>
                ) : (
                  <p className="text-sm font-bold text-text-primary uppercase tracking-tighter">{formData.subcategory || 'unisex'}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Product Status</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={compactFieldClassName}
                  >
                    <option value="active">ACTIVE</option>
                    <option value="inactive">INACTIVE</option>
                    <option value="low_stock">LOW STOCK</option>
                    <option value="out_of_stock">OUT OF STOCK</option>
                  </select>
                ) : (
                  <p className="text-sm font-bold text-primary uppercase">{formData.status}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6 border-b border-primary/10 pb-2">Pricing & Inventory</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase mb-1">Price</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 font-bold">₦</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-primary">₦{parseFloat(formData.price || 0).toLocaleString()}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Stock Quantity</label>
                {isEditing ? (
                   <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className={compactFieldClassName}
                   />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${formData.stock_quantity > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <p className="text-lg font-bold text-text-primary">{formData.stock_quantity} <span className="text-xs text-text-muted font-normal">units</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
             <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-border pb-2">Shipping Specs</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Weight (kg)</label>
                   {isEditing ? (
                      <input 
                        type="number" 
                        step="0.1" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        className={compactFieldClassName}
                      />
                   ) : (
                     <p className="text-sm font-bold text-text-primary">{formData.weight || '0'} kg</p>
                   )}
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Dimensions (cm)</label>
                   {isEditing ? (
                      <div className="flex gap-1">
                         <input name="dim_length" value={formData.dimensions.length} onChange={handleInputChange} placeholder="L" className="w-full px-2 py-2 bg-background border border-border rounded text-xs text-text-primary placeholder:text-text-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                         <input name="dim_width" value={formData.dimensions.width} onChange={handleInputChange} placeholder="W" className="w-full px-2 py-2 bg-background border border-border rounded text-xs text-text-primary placeholder:text-text-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                         <input name="dim_height" value={formData.dimensions.height} onChange={handleInputChange} placeholder="H" className="w-full px-2 py-2 bg-background border border-border rounded text-xs text-text-primary placeholder:text-text-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </div>
                   ) : (
                     <p className="text-sm font-bold text-text-primary">
                        {formData.dimensions.length || '0'}x{formData.dimensions.width || '0'}x{formData.dimensions.height || '0'}
                     </p>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
