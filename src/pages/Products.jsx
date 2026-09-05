import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, searchProducts, updateProduct, deleteProduct } from '../api/productApi';
import StatsCards from '../components/StatsCards';
import ProductCard from '../components/ProductCard';
import EditPopup from '../components/EditPopup';

const Products = () => {
  const navigate = useNavigate();
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

    const price = Number(formData.get ? formData.get('price') : formData.price || 0);
    const discountPrice = Number(formData.get ? formData.get('discountPrice') : formData.discountPrice || 0);

    if (discountPrice > price) {
      alert('Validation Alert: The discount price cannot be higher than the original price.');
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
      let detailedMsg = 'Check The Server Error, Please Try Again Later.';

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

  if (loading && allItems.length === 0) {
    return (
      <div className="p-8 min-h-screen bg-bg-main text-secondary text-center flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-bg-main text-danger text-center flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-bg-main text-primary">
      {/* Header Bar */}
      <div className="bg-card border border-border-custom rounded-2xl p-5 px-6 flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 border border-border-custom rounded-xl flex items-center justify-center bg-bg-main text-active">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold text-secondary tracking-[1.5px] block">
              PRODUCT DASHBOARD
            </span>
            <h1 className="text-3xl font-extrabold text-primary mt-0.5">Products</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/products/add')}
          className="bg-active hover:opacity-90 text-bg-main px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards
        total={allItems.length}
        featured={allItems.filter((p) => p.isFeatured || p.featured).length}
        inStock={allItems.filter((p) => p.stock > 0).length}
        outOfStock={allItems.filter((p) => !p.stock || p.stock === 0).length}
        activeStatFilter={activeStatFilter}
        setActiveStatFilter={setActiveStatFilter}
      />

      {/* Search & Filter Section */}
      <div className="bg-card border border-border-custom rounded-2xl p-3 mb-6">
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex items-center bg-bg-main border border-border-custom rounded-xl px-4 py-2.5">
            <svg className="w-5 h-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent text-primary text-sm outline-none placeholder:text-secondary"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`border px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              showFilters
                ? 'bg-bg-main border-active text-primary'
                : 'bg-bg-main border-border-custom text-secondary hover:text-primary'
            }`}
          >
            <svg className="w-4 h-4 text-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>

          <button
            onClick={handleSearch}
            className="bg-active hover:opacity-90 text-bg-main px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-custom">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-primary text-sm outline-none focus:border-active"
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1.5">
                Subcategory
              </label>
              <input
                type="text"
                placeholder="e.g. smartphones"
                value={subCategorySearch}
                onChange={(e) => setSubCategorySearch(e.target.value)}
                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-primary text-sm outline-none placeholder:text-secondary focus:border-active"
              />
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {shownItems.map((item, index) => {
          const id = item._id || item.id;
          return (
            <ProductCard
              key={id || index}
              item={item}
              onView={() => navigate(`/products/${id}`)}
              onEdit={() => navigate(`/products/edit/${id}`)}
              onQuickEdit={(prod) => setEditingItem(prod)}
              onDelete={deleteItem}
              isDeleting={deletingId === id}
            />
          );
        })}
      </div>

      {/* Edit Popup Modal */}
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