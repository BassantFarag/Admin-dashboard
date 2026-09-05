import React, { useState, useRef } from 'react';

const EditPopup = ({ item, onClose, onSave, isSaving, isDark = true }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: item?.name || '',
    shortDescription: item?.shortDescription || '',
    description: item?.description || '',
    price: Number(item?.price) || 0,
    discountPrice: Number(item?.discountPrice) || 0,
    stock: Number(item?.stock) || 0,
    sku: String(item?.sku || ''),
    category: item?.category || 'electronics',
    subcategory: item?.subcategory || item?.subCategory || '',
    brand: item?.brand || '',
    tags: Array.isArray(item?.tags)
      ? item.tags.join(', ')
      : item?.tags || '',
    featured: Boolean(item?.featured || item?.isFeatured),
    isActive:
      item?.isActive !== undefined
        ? Boolean(item.isActive)
        : true,
  });

  const [existingImages, setExistingImages] = useState(() => {
    if (Array.isArray(item?.images) && item.images.length > 0) {
      return item.images
        .map((img) => {
          if (typeof img === 'object') {
            return {
              public_id: img.public_id || '',
              url: img.url || '',
            };
          }
          return {
            public_id: '',
            url: String(img),
          };
        })
        .filter((img) => img.url);
    }
    if (item?.image) {
      const image =
        typeof item.image === 'object'
          ? item.image
          : {
              public_id: '',
              url: String(item.image),
            };
      return image.url ? [image] : [];
    }
    return [];
  });

  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      alert('You can upload maximum 5 images.');
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Please select image files only.');
      return;
    }

    setNewImages((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    const image = existingImages[indexToRemove];
    if (image?.public_id) {
      setDeletedImages((prev) => {
        if (prev.includes(image.public_id)) return prev;
        return [...prev, image.public_id];
      });
    }
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveClick = () => {
    if (!formData.name.trim()) {
      alert('Please enter product name');
      return;
    }

    const formattedTags =
      typeof formData.tags === 'string'
        ? formData.tags
            .split(',')
            .map((t) => t.trim().replace(/^#/, ''))
            .filter(Boolean)
        : Array.isArray(formData.tags)
          ? formData.tags
          : [];

    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('shortDescription', formData.shortDescription.trim());
    data.append('description', formData.description.trim());
    data.append('price', String(Number(formData.price) || 0));
    data.append('discountPrice', String(Number(formData.discountPrice) || 0));
    data.append('stock', String(Number(formData.stock) || 0));
    data.append('sku', formData.sku.trim());
    data.append('category', formData.category);
    data.append('subcategory', formData.subcategory.trim());
    data.append('brand', formData.brand.trim());
    if (formattedTags.length > 0) {
      formattedTags.forEach((tag) => {
        data.append('tags', tag);
      });
    } else {
      data.append('tags', []);
    }
    data.append('featured', String(Boolean(formData.featured)));
    data.append('isActive', String(Boolean(formData.isActive)));

    newImages.forEach((file) => {
      data.append('images', file);
    });

    if (deletedImages.length > 0) {
      data.append('deletedImages', JSON.stringify(deletedImages));
    }

    onSave(data);
  };


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border-custom text-primary rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-custom">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-active"></span>
            <h2 className="text-xl font-bold text-primary">Edit Product</h2>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-active text-xl transition-colors">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Gallery Section */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-bg-main border border-border-custom rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary font-semibold mb-1 text-sm">
                <span>🖼️</span> Product Gallery
              </div>
              <p className="text-xs text-secondary mb-4">Upload product images (max 5)</p>

              <div className="space-y-3 mb-4">
                {existingImages.map((image, idx) => (
                  <div key={`existing-${image.public_id || idx}`} className="relative group rounded-xl overflow-hidden bg-card border border-border-custom">
                    <img src={image.url} alt={`Product ${idx + 1}`} className="w-full h-36 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
                {newImages.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden bg-card border border-border-custom">
                    <img src={URL.createObjectURL(file)} alt={`New Product ${idx + 1}`} className="w-full h-36 object-cover" />
                    <div className="absolute top-2 left-2 bg-active text-bg-main text-[10px] font-bold px-2 py-1 rounded">New</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-2 right-2 bg-danger text-white text-xs px-2 py-1 rounded transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border-custom hover:border-active rounded-xl p-6 text-center cursor-pointer transition-colors bg-card"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                />
                <div className="text-2xl mb-2">📥</div>
                <p className="text-xstext-primary font-medium mb-1">Click to upload new image</p>
                <p className="text-[10px] text-secondary">PNG, JPG, WEBP</p>
                <p className="text-[10px]text-secondary mt-1">Selected: {existingImages.length + newImages.length} / 5</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-secondary">PRODUCT NAME *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-secondary">SHORT DESCRIPTION</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-secondary">DESCRIPTION</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none bg-input border border-border-custom text-primary focus:border-active"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">PRICE</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-border-custom rounded-xl px-4 py-2.5 text-primary focus:border-active text-sm outline-none "
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">DISCOUNT PRICE</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">STOCK</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-secondary">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">CATEGORY</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                >
                  <option value="electronics">electronics</option>
                  <option value="phones">phones</option>
                  <option value="fashion">fashion</option>
                  <option value="laptops">laptops</option>
                  <option value="home">home</option>
                  <option value="beauty">beauty</option>
                  <option value="sports">sports</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">SUBCATEGORY</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">BRAND</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">TAGS</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-input border border-border-custom text-primary focus:border-active"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 border border-border-custom bg-input px-4 py-2.5 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="accent-active"
                />
                <span className="text-xs font-semibold text-primary">★ Featured</span>
              </label>

              <label className="flex items-center gap-2 border border-border-custom bg-input px-4 py-2.5 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="accent-active"
                />
                <span className="text-xs font-semibold text-primary">🔘 Active</span>
              </label>
            </div>
          </div>
           {/* Footer Actions */}
          <div className="md:col-span-12 flex justify-end gap-3 pt-4 border-t border-border-custom">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 font-medium rounded-xl text-sm transition-colors text-secondary hover:text-primary bg-input"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSaving}
              className="px-6 py-2.5 bg-active hover:bg-active-hover text-bg-main font-semibold rounded-xl text-sm transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
