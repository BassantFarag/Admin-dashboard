import React, { useState } from 'react';
import { Plus, X , ArrowBigDown} from 'lucide-react';

const AddProductForm = ({ onSubmitProduct , onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    category: 'electronics',
    subcategory: '',
    brand: '',
     featured: false,
    isActive: true,
  });

  // state for tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');



  // handle input changes for form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // handle adding a new tag
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      sku: '',
      category: 'electronics',
      subcategory: '',
      brand: '',
      featured: false,
      isActive: true,
    });
    setTags([]);
    setTagInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalProductData = {
      ...formData,
      price: Number(formData.price) || 0,
      discountPrice: Number(formData.discountPrice) || 0,
      stock: Number(formData.stock) || 0,
      tags,
    };

    if (onSubmitProduct) {
      onSubmitProduct(finalProductData);
    }

    handleReset();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-card border border-border-custom p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
      {/* Product Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary">Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="iPhone 16 Pro"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors placeholder:text-secondary/50"
          required
        />
      </div>

      {/* Short Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          placeholder="Minimum 10 characters"
          value={formData.shortDescription}
          onChange={handleChange}
          className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors placeholder:text-secondary/50"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary">Description</label>
        <textarea
          name="description"
          rows={4}
          placeholder="Minimum 20 characters"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active resize-none transition-colors placeholder:text-secondary/50"
        />
      </div>

      {/* Price & Discount Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary">Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors"
          />
        </div>
      </div>

      {/* Stock & SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors"
          />
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/*Category  */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium text-primary">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full relative bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors appearance-none cursor-pointer"
          >
            <option value="electronics" className="bg-card text-primary">electronics</option>
            <option value="phones" className="bg-card text-primary">phones</option>
            <option value="fashion" className="bg-card text-primary">fashion</option>
            <option value="home" className="bg-card text-primary">home</option>
            <option value="beauty" className="bg-card text-primary">beauty</option>
            <option value="sports" className="bg-card text-primary">sports</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary">Subcategory</label>
          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors"
          />
        </div>
      </div>

      {/* Brand */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors"
        />
      </div>

      {/* Tags */}
      <div className="bg-input/50 border border-border-custom rounded-2xl p-4 space-y-3">
        <label className="text-sm font-medium text-primary block">Tags</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a tag and press +"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
            className="flex-1 bg-input border border-border-custom text-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-active transition-colors placeholder:text-secondary/50"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="w-12 h-12 bg-disabled/40 hover:bg-disabled text-primary rounded-2xl text-xl font-bold flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-active-bg text-active text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 border border-border-custom">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-danger font-bold cursor-pointer">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-secondary">Add one or more tags to organize the product.</p>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-2 bg-input border border-border-custom px-5 py-3 rounded-2xl cursor-pointer hover:border-active transition-colors">
          <input
            type="checkbox"
             name="featured" 
             checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-active cursor-pointer"
          />
          <span className="text-sm font-medium text-primary">Featured</span>
        </label>

        <label className="flex items-center gap-2 bg-input border border-border-custom px-5 py-3 rounded-2xl cursor-pointer hover:border-active transition-colors">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-active cursor-pointer"
          />
          <span className="text-sm font-medium text-primary">Active</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-custom">
        <button
          type="button"
          className="bg-input hover:bg-disabled/50 text-secondary font-medium px-6 py-3 rounded-2xl text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-active hover:bg-active-hover text-primary font-semibold px-6 py-3 rounded-2xl text-sm transition-colors cursor-pointer"
        >
          Create Product
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;