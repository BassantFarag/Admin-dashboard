// Products.js (تم تغيير الأسماء وإزالة التعليقات)
import React, { useState, useEffect, useRef } from 'react';
import { getProducts, searchProducts, updateProduct, deleteProduct } from '../api/productApi';
import './Products.css';

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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
        images: [imageUrl]
      }));
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: FALLBACK_IMAGE,
      images: [FALLBACK_IMAGE]
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <div className="popup-head">
          <div className="popup-title">
            <span className="status-dot"></span>
            <h2>Edit Product</h2>
          </div>
          <button className="popup-close" onClick={onClose} disabled={isSaving}>✕</button>
        </div>

        <form className="popup-body" onSubmit={handleSubmit}>
          <div className="popup-grid">
            <div className="left-section">
              <div className="gallery-head">
                <div className="gallery-icon"><img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
                <div>
                  <h4>Product Gallery</h4>
                  <p>Upload and manage images</p>
                </div>
              </div>

              <div className="image-preview">
                <img 
                  src={formData.image} 
                  alt="Product Preview" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <span className="image-label">Image 1</span>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/png, image/jpeg, image/webp"
                style={{ display: 'none' }} 
              />

              <div className="upload-zone" onClick={handleUploadClick}>
                <span className="upload-symbol"><img src="../../icons/folder_20dp_FFFF55_FILL0_wght400_GRAD0_opsz20.png" alt="" /></span>
                <p className="upload-txt">Click to upload images</p>
                <span className="upload-sub">PNG, JPG, WEBP</span>
              </div>

              <button type="button" className="remove-pic" onClick={handleRemoveImage}>
                ✕ Remove
              </button>
            </div>

            <div className="right-section">
              <div className="input-group">
                <label>PRODUCT NAME *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <label>SHORT DESCRIPTION *</label>
                <input 
                  type="text" 
                  name="shortDescription" 
                  value={formData.shortDescription} 
                  onChange={handleChange} 
                />
              </div>

              <div className="input-group">
                <label>DESCRIPTION *</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  value={formData.description} 
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>PRICE</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="input-group">
                  <label>DISCOUNT PRICE</label>
                  <input 
                    type="number" 
                    name="discount" 
                    value={formData.discount} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>STOCK</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="input-group">
                  <label>SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formData.sku} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>CATEGORY</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                  >
                    {CATEGORIES_LIST.filter(c => c !== 'All Categories').map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>SUBCATEGORY</label>
                  <input 
                    type="text" 
                    name="subCategory" 
                    value={formData.subCategory} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>BRAND</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="input-group">
                  <label>TAGS</label>
                  <input 
                    type="text" 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="input-row toggle-row">
                <button 
                  type="button" 
                  className={`toggle-switch ${formData.isFeatured ? 'active' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, isFeatured: !p.isFeatured }))}
                >
                  <span className="dot"></span> Featured
                </button>
                <button 
                  type="button" 
                  className={`toggle-switch ${formData.isActive ? 'active' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                >
                  <span className="dot"></span> Active
                </button>
              </div>
            </div>
          </div>

          <div className="popup-footer">
            <button type="button" className="cancel-action" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="save-action" disabled={isSaving}>
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
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    const singleImage = item.image || item.img || item.imageUrl;
    return singleImage ? [singleImage] : [FALLBACK_IMAGE];
  };

  const imagesList = getImagesList();

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <div className="item-card">
      <div className="item-pic-wrap">
        <img 
          src={imagesList[currentImageIndex] || FALLBACK_IMAGE} 
          alt={item.name || item.title || 'Product'} 
          className="item-pic" 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        <button className="nav-arrow left-arrow" onClick={handlePrevImage} aria-label="Previous image">
          ‹
        </button>
        <button className="nav-arrow right-arrow" onClick={handleNextImage} aria-label="Next image">
          ›
        </button>

        {(item.isFeatured || item.featured) && (
          <span className="feature-badge">★ Featured</span>
        )}

        <span className={`stock-badge ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
        </span>
      </div>

      <div className="item-details">
        <h3 className="item-title">{item.name || item.title}</h3>
        <p className="item-category">{item.category}</p>
        <p className="item-desc">{item.description}</p>
        
        <div className="price-area">
          <span className="price-tag">${item.price}</span>
          {item.discount > 0 && (
            <span className="discount-tag">-${item.discount} off</span>
          )}
        </div>

        <div className="tag-list">
          {Array.isArray(item.tags) && item.tags.map((tag, idx) => (
            <span key={idx} className="tag-item">{tag}</span>
          ))}
        </div>

        <div className="action-bar">
          <button className="view-btn">👁 View</button>
          <button className="edit-btn">✏️ Edit</button>
          <button className="quick-btn" onClick={() => onQuickEdit(item)}>⚡ Quick Edit</button>
          <button 
            className="del-btn" 
            onClick={() => onDelete(item._id || item.id)}
            disabled={isDeleting}
          >
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

    if (searchTerm.trim() !== '') {
      result = result.filter((item) => {
        const title = (item.name || item.title || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        const query = searchTerm.toLowerCase();
        return title.includes(query) || category.includes(query);
      });
    }

    if (selectedCategory !== 'All Categories') {
      result = result.filter((item) => 
        (item.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (subCategoryInput.trim() !== '') {
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
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setShownItems(allItems);
      return;
    }

    try {
      setLoading(true);
      const response = await searchProducts({ q: searchTerm, name: searchTerm });
      const data = response?.data?.products || response?.data?.data || response?.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setShownItems(data);
      }
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

      setAllItems((prev) =>
        prev.map((p) =>
          (p._id || p.id) === itemId ? savedData : p
        )
      );
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update product in database:', err);
      alert('Failed to save changes to the database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

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

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="shop-manager">
      <div className="shop-header">
        <div className="head-start">
          <div className="header-icon-box">
            <img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div>
            <span className="head-sub">PRODUCT DASHBOARD</span>
            <h1 className="head-main">Products</h1>
          </div>
        </div>
        <button className="add-item-btn">+ Add Product</button>
      </div>

      <div className="stat-holder">
        <div 
          className={`info-box ${activeStatFilter === 'all' ? 'active-stat' : ''}`}
          onClick={() => setActiveStatFilter('all')}
        >
          <div className="info-icon">
            <img src="../../icons/store_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div className="info-number">{totalProducts}</div>
          <div className="info-label">Total</div>
        </div>

        <div 
          className={`info-box ${activeStatFilter === 'featured' ? 'active-stat' : ''}`}
          onClick={() => setActiveStatFilter('featured')}
        >
          <div className="info-icon">
            <img src="../../icons/star_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div className="info-number">{featuredProducts}</div>
          <div className="info-label">Featured</div>
        </div>

        <div 
          className={`info-box ${activeStatFilter === 'inStock' ? 'active-stat' : ''}`}
          onClick={() => setActiveStatFilter('inStock')}
        >
          <div className="info-icon">
            <img src="../../icons/chart_data_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div className="info-number">{inStockProducts}</div>
          <div className="info-label">In Stock</div>
        </div>

        <div 
          className={`info-box ${activeStatFilter === 'outOfStock' ? 'active-stat' : ''}`}
          onClick={() => setActiveStatFilter('outOfStock')}
        >
          <div className="info-icon">
            <img src="../../icons/settings_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          <div className="info-number">{outOfStockProducts}</div>
          <div className="info-label">Out of Stock</div>
        </div>
      </div>

      <form className="search-wrap" onSubmit={handleSearchSubmit}>
        <div className="search-box">
          <span className="search-magnifier">
            <img src="../../icons/search_25dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </span>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          type="button" 
          className={`filter-toggler ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          ⚙ Filters
        </button>

        <button type="submit" className="search-go">
          <img src="../../icons/search_25dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" /> Search
        </button>
      </form>

      {showFilters && (
        <div className="extra-filters">
          <div className="filter-set">
            <label className="filter-name">🏷️ CATEGORY</label>
            <select 
              className="filter-choice"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES_LIST.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-set">
            <label className="filter-name">🏷️ SUBCATEGORY</label>
            <input 
              type="text" 
              className="filter-field"
              placeholder="e.g. smartphones" 
              value={subCategoryInput}
              onChange={(e) => setSubCategoryInput(e.target.value)}
            />
          </div>
        </div>
      )}

      {shownItems.length === 0 && !loading && (
        <div className="no-products-box">
          <div className="no-products-icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      <div className="product-list">
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