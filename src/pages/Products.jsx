import React, { useState, useEffect, useRef ,useNavigate} from 'react';
import { getProducts, searchProducts, updateProduct, deleteProduct } from '../api/productApi';
import Loading from '../components/Loading';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';

const CATEGORIES_LIST = [
  'All Categories',
  'electronics',
  'phones',
  'fashion',
  'home',
  'beauty',
  'sports'
];

const EditPopup = ({ item, onClose, onSave, isSaving }) => {
  const fileInputRef = useRef(null);

  const getItemImage = () => {
    if (Array.isArray(item?.images) && item.images.length > 0) {
      return item.images[0];
    }
    return item?.image || item?.img || item?.imageUrl || FALLBACK_IMAGE;
  };

  const [formData, setFormData] = useState({
    name: item?.name || item?.title || '',
    shortDescription: item?.shortDescription || '',
    description: item?.description || '',
    price: item?.price || 0,
    discount: item?.discount || 0,
    stock: item?.stock || 0,
    sku: item?.sku || '',
    category: item?.category || 'sports',
    subCategory: item?.subCategory || item?.subcategory || '',
    brand: item?.brand || '',
    tags: Array.isArray(item?.tags) ? item.tags.join(', ') : item?.tags || '',
    isFeatured: item?.isFeatured || item?.featured || false,
    isActive: item?.isActive ?? true,
    image: getItemImage()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl, images: [imageUrl] }));
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: FALLBACK_IMAGE, images: [FALLBACK_IMAGE] }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...item,
      ...formData,
      images: formData.images || [formData.image],
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
        : formData.tags
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[99999] p-5">
      <div className="bg-[#14161d] border border-[#232733] rounded-2xl w-[92vw] max-w-[1180px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#232733]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#f9fdff] rounded-full"></span>
            <h2 className="text-base font-semibold text-white m-0">Edit Product</h2>
          </div>
          <button onClick={onClose} disabled={isSaving} className="bg-[#1a1d26] border border-[#282d3c] text-[#8b949e] w-7 h-7 rounded-md flex items-center justify-center text-sm hover:text-white hover:bg-[#252a38] transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-[320px_1fr] gap-7">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div className="bg-[#1a1d26] border border-[#282d3c] p-2 rounded-md">
                  <img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
                </div>
                <div>
                  <h4 className="text-sm text-[#f8fafc] m-0">Product Gallery</h4>
                  <p className="text-xs text-[#8b949e] mt-0.5">Upload and manage images</p>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-[#282d3c] h-[170px] bg-[#08090c]">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                />
                <span className="absolute bottom-2 left-2 bg-[#14161d]/90 border border-[#282d3c] text-[#cbd5e1] px-2 py-0.5 text-[10px] rounded">Image 1</span>
              </div>

              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
              <div onClick={handleUploadClick} className="border border-dashed border-[#282d3c] rounded-lg p-6 text-center bg-[#1a1d26] cursor-pointer hover:border-[#f9fdff] hover:bg-[#212532] transition-colors">
                <span className="text-xl inline-block p-1 rounded">📁</span>
                <p className="text-xs text-[#8b949e] mt-1.5">Click to upload images</p>
                <span className="text-[10px] text-[#6e7681]">PNG, JPG, WEBP</span>
              </div>
              <button type="button" onClick={handleRemoveImage} className="bg-transparent border border-[#282d3c] text-[#8b949e] py-2 px-2 rounded text-xs self-start hover:text-[#f9fdff] hover:border-red-500/40 transition-colors">
                ✕ Remove
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">PRODUCT NAME *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">SHORT DESCRIPTION *</label>
                <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">DESCRIPTION *</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">PRICE</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">DISCOUNT PRICE</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">STOCK</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">CATEGORY</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full">
                    {CATEGORIES_LIST.filter(c => c !== 'All Categories').map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">SUBCATEGORY</label>
                  <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">BRAND</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8b949e] tracking-[0.5px]">TAGS</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="bg-[#1a1d26] border border-[#282d3c] rounded px-3.5 py-2.5 text-[#f8fafc] text-sm focus:border-[#00b7ff] outline-none w-full" placeholder="comma separated" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5 mt-1">
                <button type="button" className={`bg-[#1a1d26] border ${formData.isFeatured ? 'border-[#e6eeee] text-[#f9fdff]' : 'border-[#282d3c] text-[#8b949e]'} rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs cursor-pointer transition-colors`}
                  onClick={() => setFormData(p => ({ ...p, isFeatured: !p.isFeatured }))}>
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.isFeatured ? 'bg-[#cfd2d2]' : 'bg-[#6e7681]'}`}></span>
                  Featured
                </button>
                <button type="button" className={`bg-[#1a1d26] border ${formData.isActive ? 'border-[#e6eeee] text-[#f9fdff]' : 'border-[#282d3c] text-[#8b949e]'} rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs cursor-pointer transition-colors`}
                  onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}>
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.isActive ? 'bg-[#cfd2d2]' : 'bg-[#6e7681]'}`}></span>
                  Active
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#232733]">
            <button type="button" onClick={onClose} disabled={isSaving} className="bg-[#1a1d26] text-[#8b949e] border border-[#282d3c] py-2.5 px-5 rounded-md hover:bg-[#252a38] hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="bg-[#f9fdff] text-black border-none py-2.5 px-5 rounded-md font-bold hover:bg-black hover:text-[#f9fdff] transition-colors">
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ItemCard = ({ item, onQuickEdit, onDelete, isDeleting }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImagesList = () => {
    if (Array.isArray(item.images) && item.images.length > 0) return item.images;
    const single = item.image || item.img || item.imageUrl;
    return single ? [single] : [FALLBACK_IMAGE];
  };
  const imagesList = getImagesList();

  const handleNext = (e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % imagesList.length); };
  const handlePrev = (e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length); };

  return (
    <div className="group bg-[#14161d] rounded-2xl shadow-xl overflow-hidden border border-[#232733] flex flex-col transition-all duration-200 hover:border-[#f9fdff] w-[480px]">
      <div className="relative h-72 bg-[#08090c] overflow-hidden">
        <img 
          src={imagesList[currentImageIndex] || FALLBACK_IMAGE} 
          alt={item.name || item.title || 'Product'} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
        />
        <button onClick={handlePrev} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#14161d]/85 text-white border border-white/15 flex items-center justify-center text-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#14161d]/98 hover:border-white/40 z-10">
          ‹
        </button>
        <button onClick={handleNext} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#14161d]/85 text-white border border-white/15 flex items-center justify-center text-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#14161d]/98 hover:border-white/40 z-10">
          ›
        </button>
        {(item.isFeatured || item.featured) && (
          <span className="absolute top-3.5 left-3.5 bg-[#ffb800] text-black py-1 px-3 rounded-full text-xs font-bold z-10">★ Featured</span>
        )}
        <span className={`absolute bottom-3.5 right-3.5 py-1.5 px-3.5 rounded-full text-xs font-semibold z-10 ${item.stock > 0 ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30' : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'}`}>
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-1.5">{item.name || item.title}</h3>
        <p className="text-xs font-bold text-[#8b949e] uppercase tracking-[0.8px] mb-3">{item.category}</p>
        <p className="text-sm text-[#8b949e] leading-relaxed mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-3 mb-3.5">
          <span className="text-3xl font-extrabold text-white">${item.price}</span>
          {item.discount > 0 && <span className="text-sm font-bold text-[#10b981]">-${item.discount} off</span>}
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.isArray(item.tags) && item.tags.map((tag, idx) => (
            <span key={idx} className="bg-[#1a1d26] border border-[#282d3c] text-[#8b949e] text-xs py-1 px-3 rounded-lg">{tag}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 py-2 border border-[#282d3c] rounded-lg text-xs font-semibold bg-[#1a1d26] text-[#8b949e] transition-all duration-200 hover:bg-[#252a38] hover:text-white hover:border-[#f9fdff]">👁 View</button>
          <button onClick={() => onQuickEdit(item)} className="flex-1 py-2 border border-[#282d3c] rounded-lg text-xs font-semibold bg-[#1a1d26] text-[#8b949e] transition-all duration-200 hover:bg-[#252a38] hover:text-white hover:border-[#f9fdff]">✏️ Edit</button>
          <button onClick={() => onQuickEdit(item)} className="flex-1 py-2 border border-[#282d3c] rounded-lg text-xs font-semibold bg-[#1a1d26] text-[#8b949e] transition-all duration-200 hover:bg-[#252a38] hover:text-white hover:border-[#f9fdff]">⚡ Quick Edit</button>
          <button onClick={() => onDelete(item._id || item.id)} disabled={isDeleting} className="flex-1 py-2 border border-[#ef4444]/20 rounded-lg text-xs font-semibold bg-[#ef4444]/10 text-[#ef4444] transition-all duration-200 hover:bg-[#ef4444]/20 hover:border-[#f9fdff]">
            🗑 {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [allItems, setAllItems] = useState([]);
  const [shownItems, setShownItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [activeStatFilter, setActiveStatFilter] = useState('all');

  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const data = response?.data?.products || response?.data?.data || response?.data || [];
      const itemsArray = Array.isArray(data) ? data : [];
      setAllItems(itemsArray);
      setShownItems(itemsArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  useEffect(() => {
    let result = [...allItems];
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const title = (item.name || item.title || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        return title.includes(query) || category.includes(query);
      });
    }
    if (selectedCategory !== 'All Categories') {
      result = result.filter((item) => (item.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }
    if (subCategoryInput.trim()) {
      result = result.filter((item) => 
        (item.subCategory || item.subcategory || '').toLowerCase().includes(subCategoryInput.toLowerCase())
      );
    }
    if (activeStatFilter === 'featured') {
      result = result.filter((p) => p.isFeatured || p.featured);
    } else if (activeStatFilter === 'inStock') {
      result = result.filter((p) => p.stock > 0);
    } else if (activeStatFilter === 'outOfStock') {
      result = result.filter((p) => !p.stock || p.stock === 0);
    }
    setShownItems(result);
  }, [searchTerm, selectedCategory, subCategoryInput, activeStatFilter, allItems]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setShownItems(allItems);
      return;
    }
    try {
      setLoading(true);
      const response = await searchProducts({ q: searchTerm, name: searchTerm });
      const data = response?.data?.products || response?.data?.data || response?.data || [];
      if (Array.isArray(data) && data.length > 0) setShownItems(data);
    } catch (err) {
      console.warn('Fallback to local filtering');
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (updatedItem) => {
    const itemId = updatedItem._id || updatedItem.id;
    try {
      setIsSaving(true);
      const response = await updateProduct(itemId, updatedItem);
      const savedData = response?.data?.product || response?.data || updatedItem;
      setAllItems((prev) => prev.map((p) => (p._id || p.id) === itemId ? savedData : p));
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update product in database:', err);
      alert('Failed to save changes to the database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeletingId(itemId);
      await deleteProduct(itemId);
      setAllItems((prev) => prev.filter((p) => (p._id || p.id) !== itemId));
    } catch (err) {
      console.error('Failed to delete product from database:', err);
      alert('Failed to delete the product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalProducts = allItems.length;
  const featuredProducts = allItems.filter((p) => p.isFeatured || p.featured).length;
  const inStockProducts = allItems.filter((p) => p.stock > 0).length;
  const outOfStockProducts = allItems.filter((p) => !p.stock || p.stock === 0).length;

  if (loading) return <div className="p-6 min-h-screen bg-[#08090c] text-[#8b949e] text-center text-lg mt-16">Loading products...</div>;
  if (error) return <div className="p-6 min-h-screen bg-[#08090c] text-[#ef4444] p-3 rounded border border-[#ef4444]/30 mb-5">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-[#08090c] text-[#f0f6fc] font-sans">
      <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-5 px-6 flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 border border-[#282d3c] rounded-xl flex items-center justify-center bg-[#1a1d26] text-xl">
            <img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8b949e] tracking-[1.5px] block">PRODUCT DASHBOARD</span>
            <h1 className="text-3xl font-extrabold text-white mt-0.5">Products</h1>
          </div>
        </div>
        <button className="bg-[#1a1d26] text-white border border-[#2d3345] py-2.5 px-5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#252a38] hover:border-[#f9fdff] transition-all">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div 
          className={`bg-[#14161d] border ${activeStatFilter === 'all' ? 'border-[#f9fdff] shadow-[0_0_12px_rgba(0,183,255,0.15)]' : 'border-[#232733]'} rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200 hover:border-[#f9fdff] hover:-translate-y-0.5`}
          onClick={() => setActiveStatFilter('all')}
        >
          <div className="w-8 h-8 bg-[#1f232e] rounded-lg flex items-center justify-center mb-4"><img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
          <span className="text-2xl font-extrabold text-white leading-none mb-1.5">{totalProducts}</span>
          <span className="text-xs text-[#8b949e] font-medium">Total</span>
        </div>
        <div 
          className={`bg-[#14161d] border ${activeStatFilter === 'featured' ? 'border-[#f9fdff] shadow-[0_0_12px_rgba(0,183,255,0.15)]' : 'border-[#232733]'} rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200 hover:border-[#f9fdff] hover:-translate-y-0.5`}
          onClick={() => setActiveStatFilter('featured')}
        >
          <div className="w-8 h-8 bg-[#1f232e] rounded-lg flex items-center justify-center mb-4"><img src="../../icons/star_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
          <span className="text-2xl font-extrabold text-white leading-none mb-1.5">{featuredProducts}</span>
          <span className="text-xs text-[#8b949e] font-medium">Featured</span>
        </div>
        <div 
          className={`bg-[#14161d] border ${activeStatFilter === 'inStock' ? 'border-[#f9fdff] shadow-[0_0_12px_rgba(0,183,255,0.15)]' : 'border-[#232733]'} rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200 hover:border-[#f9fdff] hover:-translate-y-0.5`}
          onClick={() => setActiveStatFilter('inStock')}
        >
          <div className="w-8 h-8 bg-[#1f232e] rounded-lg flex items-center justify-center mb-4"><img src="../../icons/chart_data_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
          <span className="text-2xl font-extrabold text-white leading-none mb-1.5">{inStockProducts}</span>
          <span className="text-xs text-[#8b949e] font-medium">In Stock</span>
        </div>
        <div 
          className={`bg-[#14161d] border ${activeStatFilter === 'outOfStock' ? 'border-[#f9fdff] shadow-[0_0_12px_rgba(0,183,255,0.15)]' : 'border-[#232733]'} rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200 hover:border-[#f9fdff] hover:-translate-y-0.5`}
          onClick={() => setActiveStatFilter('outOfStock')}
        >
          <div className="w-8 h-8 bg-[#1f232e] rounded-lg flex items-center justify-center mb-4"><img src="../../icons/settings_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
          <span className="text-2xl font-extrabold text-white leading-none mb-1.5">{outOfStockProducts}</span>
          <span className="text-xs text-[#8b949e] font-medium">Out of Stock</span>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="bg-[#14161d] border border-[#232733] rounded-2xl p-3.5 flex gap-3 items-center mb-6">
        <div className="flex-1 bg-[#1a1d26] border border-[#282d3c] rounded-xl flex items-center px-3.5">
          <span className="text-[#8b949e] text-sm mr-2.5"><img src="../../icons/search_25dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" /></span>
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none outline-none text-white py-3 text-sm placeholder:text-[#6e7681]" />
        </div>
        <button type="button" onClick={() => setShowFilters(!showFilters)} className={`bg-[#1a1d26] border border-[#282d3c] text-[#8b949e] py-3 px-5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:text-[#252a38] ${showFilters ? 'bg-[#00b7ff]/10 text-[#f9fdff] border-[#2c2e2f]' : ''}`}>
          ⚙ Filters
        </button>
        <button type="submit" className="bg-[#232733] flex items-center gap-2 text-white border border-[#2d3345] py-3 px-6 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#2d3345] transition-colors">
          <img src="../../icons/search_25dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" /> Search
        </button>
      </form>

      {showFilters && (
        <div className="flex gap-5 bg-[#14161d] border border-[#232733] rounded-2xl p-4 px-5 mb-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#8b949e] tracking-[0.8px] uppercase">🏷️ CATEGORY</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-[#1a1d26] border border-[#282d3c] text-white py-3 px-4 rounded-xl text-sm focus:border-[#00b7ff] outline-none">
              {CATEGORIES_LIST.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#8b949e] tracking-[0.8px] uppercase">🏷️ SUBCATEGORY</label>
            <input type="text" placeholder="e.g. smartphones" value={subCategoryInput} onChange={(e) => setSubCategoryInput(e.target.value)} className="bg-[#1a1d26] border border-[#282d3c] text-white py-3 px-4 rounded-xl text-sm focus:border-[#00b7ff] outline-none" />
          </div>
        </div>
      )}

      {shownItems.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-[#8b949e] text-center">
          <span className="text-4xl opacity-50 mb-3">📦</span>
          <h3 className="text-lg font-bold text-white mb-1.5">No products found</h3>
          <p className="text-sm m-0">Try adjusting your search or filters</p>
        </div>
      )}

      <div className="flex flex-wrap justify-start gap-6">
        {shownItems.map((item, index) => {
          const currentId = item._id || item.id;
          return (
            <ItemCard 
              key={currentId || index} 
              item={item} 
              onQuickEdit={(prod) => setEditingItem(prod)} 
              onDelete={deleteItem} 
              isDeleting={deletingId === currentId} 
            />
          );
        })}
      </div>

      {editingItem && (
        <EditPopup 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={saveItem} 
          isSaving={isSaving} 
        />
      )}
    </div>
  );
};

export default Products;