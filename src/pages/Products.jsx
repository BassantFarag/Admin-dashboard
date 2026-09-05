import React, { useState, useEffect } from 'react';
import { getProducts, searchProducts, updateProduct, deleteProduct } from '../api/productApi';
import StatsCards from '../components/StatsCards';
import ProductCard from '../components/ProductCard';
import EditPopup from '../components/EditPopup';

const Products = () => {
  const [allItems, setAllItems] = useState([]);
  const [shownItems, setShownItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [subCategorySearch, setSubCategorySearch] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatFilter, setActiveStatFilter] = useState('all');

  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showAddProduct, setShowAddProduct] = useState(false);

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAllItems();
      return;
    }
    try {
      setLoading(true);
      const response = await searchProducts({ q: searchTerm, query: searchTerm });
      const data = response?.data?.products || response?.data?.data || response?.data || [];
      const searchResults = Array.isArray(data) ? data : [];
      setAllItems(searchResults);
      setShownItems(searchResults);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...allItems];

    if (activeStatFilter === 'featured') {
      result = result.filter((p) => p.isFeatured || p.featured);
    } else if (activeStatFilter === 'inStock') {
      result = result.filter((p) => p.stock > 0);
    } else if (activeStatFilter === 'outOfStock') {
      result = result.filter((p) => !p.stock || p.stock === 0);
    }

    if (selectedCategory !== 'All Categories') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (subCategorySearch.trim()) {
      result = result.filter((p) =>
        (p.subCategory || p.subcategory || '')
          .toLowerCase()
          .includes(subCategorySearch.toLowerCase())
      );
    }

    setShownItems(result);
  }, [activeStatFilter, selectedCategory, subCategorySearch, allItems]);

  const saveItem = async (formData) => {
    const itemId = editingItem?._id || editingItem?.id;
    if (!itemId) return;

    const price = Number(formData.get('price') || 0);
    const discountPrice = Number(formData.get('discountPrice') || 0);

    if (discountPrice > price) {
      alert("Validation Alert: The discount price cannot be higher than the original price.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateProduct(itemId, formData);
      const savedProduct = response?.data?.product || response?.data?.data || response?.data;

      const mergedProduct = {
        ...editingItem,
        ...(typeof savedProduct === 'object' ? savedProduct : {}),
      };

      setAllItems((prev) =>
        prev.map((p) => ((p._id || p.id) === itemId ? mergedProduct : p))
      );
      setShownItems((prev) =>
        prev.map((p) => ((p._id || p.id) === itemId ? mergedProduct : p))
      );

      setEditingItem(null);

      setTimeout(() => {
        fetchAllItems();
      }, 500);

    } catch (err) {
      console.error('Failed to update product on server:', err?.response?.data || err);
      
      const serverError = err?.response?.data;
      let detailedMsg = 'Cheak The Server Error, Please Try Again Later.';

      if (serverError) {
        if (typeof serverError === 'string') {
          detailedMsg = serverError;
        } else if (serverError.message) {
          detailedMsg = serverError.message;
        } else if (serverError.errors) {
          detailedMsg = Array.isArray(serverError.errors)
            ? serverError.errors.map((e) => e.message || e).join(' | ')
            : Object.values(serverError.errors).map((e) => e.message || e).join(' | ');
        } else {
          detailedMsg = JSON.stringify(serverError);
        }
      }

      alert(`Error in The Server \n${detailedMsg}`);
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
      setShownItems((prev) => prev.filter((p) => (p._id || p.id) !== itemId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && allItems.length === 0) return <div className="p-8 min-h-screen bg-[#0a0a0a] text-[#a3a3a3] text-center">Loading products...</div>;
  if (error) return <div className="p-8 min-h-screen bg-[#0a0a0a] text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 px-6 flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 border border-[#2a2a2a] rounded-xl flex items-center justify-center bg-[#1a1a1a] text-xl">
            <img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#a3a3a3] tracking-[1.5px] block">PRODUCT DASHBOARD</span>
            <h1 className="text-3xl font-extrabold text-white mt-0.5">Products</h1>
          </div>
        </div>
        <button
          className="bg-[#d4af37] hover:bg-[#c5a02e] text-black px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-[#d4af37]/20"
        >
          + Add Product
        </button>
      </div>

      <StatsCards
        total={allItems.length}
        featured={allItems.filter((p) => p.isFeatured || p.featured).length}
        inStock={allItems.filter((p) => p.stock > 0).length}
        outOfStock={allItems.filter((p) => !p.stock || p.stock === 0).length}
        activeStatFilter={activeStatFilter}
        setActiveStatFilter={setActiveStatFilter}
      />

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-3 mb-6">
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5">
            <span className="text-[#a3a3a3] mr-2"><img src="../../icons/search_25dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" /></span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent text-white text-sm outline-none placeholder-[#666]"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`border px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
              showFilters
                ? 'bg-[#1a1a1a] border-[#d4af37] text-white'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#a3a3a3] hover:text-white'
            }`}
          >
            <img src="../../icons/settings_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /> Filters
          </button>

          <button
            onClick={handleSearch}
            className="bg-[#d4af37] hover:bg-[#c5a02e] text-black px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-[#d4af37]/20"
          >
            <img src="../../icons/search_25dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" /> Search
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2a2a2a]">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1.5">
                <img src="../../icons/folder_20dp_FFFF55_FILL0_wght400_GRAD0_opsz20.png" alt="" /> Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
              >
                <option value="All Categories">All Categories</option>
                <option value="electronics">electronics</option>
                <option value="phones">phones</option>
                <option value="fashion">fashion</option>
                <option value="home">home</option>
                <option value="beauty">beauty</option>
                <option value="sports">sports</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1.5">
                 Subcategory
              </label>
              <input
                type="text"
                placeholder="e.g. smartphones"
                value={subCategorySearch}
                onChange={(e) => setSubCategorySearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-[#555] focus:border-[#d4af37]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
        {shownItems.map((item, index) => (
          <ProductCard
            key={item._id || item.id || index}
            item={item}
            onQuickEdit={(prod) => setEditingItem(prod)}
            onDelete={deleteItem}
            isDeleting={deletingId === (item._id || item.id)}
          />
        ))}
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