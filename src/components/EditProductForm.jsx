import React from 'react';

export default function ProductForm({ formData, setFormData, tags, isDark , onSubmit}) {

  const inputClass = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 ${
    isDark
      ? 'bg-[#1a1b1d] border-[#2a2b2e] text-[#f2f2f0] focus:border-[#d9a441] focus:bg-[#161719]'
      : 'bg-[#1a1b1d]/5 border-[#2a2b2e]/20 text-[#0d0e10] focus:border-[#d9a441] focus:bg-white'
  }`;

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${
    isDark ? 'text-[#c9c8c3]' : 'text-[#3a3b3e]'
  }`;

  const handleNumberChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value === '' ? '' : Number(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };
  
  return (
    <div className={`lg:col-span-2 rounded-2xl p-6 flex flex-col gap-6 justify-between transition-all duration-300 ${
      isDark ? 'bg-[#161719] border border-[#2a2b2e]' : 'bg-[#faf9f5] border border-[#e3b158]/50'
    }`}>
     
      <div>
        <label className={labelClass}>Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
        />
      </div>

     <div>
        <label className={labelClass}>short Description</label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          className={inputClass}
        />
      </div>
     
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={6}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter the full, detailed product description..."
          className={`${inputClass} resize-y min-h-[150px] leading-relaxed scrollbar-thin`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
       
        <div>
          <label className={labelClass}>Discount Price ($)</label>
          <input
            type="number"
            value={formData.discountPrice}
            onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
            className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className={labelClass}>Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className={inputClass}/>
        </div>
       
        <div>
          <label className={labelClass}>SKU</label>
          <input
            type="text"
            value={formData.sku || ''}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className={inputClass}/>
        </div>
       
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className={labelClass}>Category</label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`${inputClass} cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center]`}
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%23c9c8c3' : '%233a3b3e'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                backgroundSize: '16px'
              }}
            >
              <option value="" disabled className={isDark ? 'bg-[#1a1b1d] text-[#5a5955]' : 'bg-white text-slate-400'}>
                Select a category
              </option>
              <option value="supercars" className={isDark ? 'bg-[#1a1b1d] text-[#f8f8f6]' : 'bg-white text-[#0d0e10]'}>
               sport
              </option>
              <option value="electronics" className={isDark ? 'bg-[#1a1b1d] text-[#f8f8f6]' : 'bg-white text-[#0d0e10]'}>
                Electronics
              </option>
               <option value="phones" className={isDark ? 'bg-[#1a1b1d] text-[#f8f8f6]' : 'bg-white text-[#0d0e10]'}>
                phones
              </option>
               <option value="homes" className={isDark ? 'bg-[#1a1b1d] text-[#f8f8f6]' : 'bg-white text-[#0d0e10]'}>
                homes
              </option>
              <option value="accessories" className={isDark ? 'bg-[#1a1b1d] text-[#f8f8f6]' : 'bg-white text-[#0d0e10]'}>
                Accessories
              </option>
            </select>
          </div>

        <div>
          <label className={labelClass}>subcategory</label>
          <input
            type="text"
            value={formData.subcategory || ''}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      
      <div>
        <label className={labelClass}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags && tags.map((tag, i) => (
            <span 
              key={i} 
              className={`px-3 py-1 border rounded-lg text-xs font-semibold transition-colors ${
                isDark
                  ? 'bg-[#332813] border-[#d9a441]/30 text-[#e3b158]'
                  : 'bg-[#e3b158]/10 border-[#e3b158]/30 text-[#d9a441]'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
      <button 
        type="button"
        onClick={onSubmit} 
        className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 shadow-md cursor-pointer active:scale-95 ${
          isDark
            ? 'bg-[#e3b158] hover:bg-[#d9a441] text-[#0d0e10] shadow-[#e3b158]/10 hover:shadow-[#d9a441]/30'
            : 'bg-[#e3b158] hover:bg-[#d9a441] text-[#0d0e10] shadow-[#e3b158]/20 hover:shadow-[#d9a441]/40'
        }`}>
        Save Changes
      </button>
</div>

    </div>
  );
}
