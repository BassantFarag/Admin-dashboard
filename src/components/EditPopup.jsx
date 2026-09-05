import React, { useState, useRef } from 'react';

const EditPopup = ({ item, onClose, onSave, isSaving }) => {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-[#a3a3a3]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <h2 className="text-xl font-bold text-white">Edit Product</h2>
          </div>
          <button onClick={onClose} className="text-[#a3a3a3] hover:text-white text-xl transition-colors">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-4">
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-1 text-sm">
                <span>🖼️</span> Product Gallery
              </div>
              <p className="text-xs text-[#a3a3a3] mb-4">Upload product images (max 5)</p>

              <div className="space-y-3 mb-4">
                {existingImages.map((image, idx) => (
                  <div key={`existing-${image.public_id || idx}`} className="relative group rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
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
                  <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
                    <img src={URL.createObjectURL(file)} alt={`New Product ${idx + 1}`} className="w-full h-36 object-cover" />
                    <div className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] px-2 py-1 rounded">New</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2a2a2a] hover:border-[#d4af37] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#0a0a0a]"
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
                <p className="text-xs text-white font-medium mb-1">Click to upload new image</p>
                <p className="text-[10px] text-[#a3a3a3]">PNG, JPG, WEBP</p>
                <p className="text-[10px] text-[#666] mt-1">Selected: {existingImages.length + newImages.length} / 5</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">PRODUCT NAME *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">SHORT DESCRIPTION</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">DESCRIPTION</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">PRICE</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">DISCOUNT PRICE</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">STOCK</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">CATEGORY</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">SUBCATEGORY</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">BRAND</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a3a3a3] block mb-1">TAGS</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] px-4 py-2.5 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="accent-[#d4af37]"
                />
                <span className="text-xs font-semibold text-white">★ Featured</span>
              </label>

              <label className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] px-4 py-2.5 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="accent-[#d4af37]"
                />
                <span className="text-xs font-semibold text-white">🔘 Active</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-12 flex justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#141414] hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-white font-medium rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#c5a02e] text-black font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-[#d4af37]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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