import React, { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';

const ProductCard = ({ item, onQuickEdit, onDelete, isDeleting }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const extractImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') {
      if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image')) {
        return img;
      }
      return img;
    }
    if (typeof img === 'object') {
      return img.url || img.secure_url || img.path || img.src || null;
    }
    return null;
  };

  const getImagesList = () => {
    let rawImages = [];

    if (Array.isArray(item?.images) && item.images.length > 0) {
      rawImages = item.images;
    } else if (Array.isArray(item?.image) && item.image.length > 0) {
      rawImages = item.image;
    } else if (item?.images) {
      rawImages = [item.images];
    } else if (item?.image) {
      rawImages = [item.image];
    } else if (item?.img) {
      rawImages = [item.img];
    } else if (item?.imageUrl) {
      rawImages = [item.imageUrl];
    } else if (item?.coverImage) {
      rawImages = [item.coverImage];
    } else if (item?.thumbnail) {
      rawImages = [item.thumbnail];
    }

    const cleanedImages = rawImages
      .map(extractImageUrl)
      .filter((url) => url !== null && url !== '' && url !== 'undefined');

    return cleanedImages.length > 0 ? cleanedImages : [FALLBACK_IMAGE];
  };

  const imagesList = getImagesList();

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <div className="group bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col w-full max-w-[480px] justify-self-center shadow-lg transition-all duration-300 hover:border-[#d4af37] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] hover:-translate-y-1">
      
      <div className="relative w-full h-[230px] bg-[#0a0a0a] overflow-hidden">
        <img
          src={imagesList[currentImageIndex] || FALLBACK_IMAGE}
          alt={item.name || item.title || 'Product'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              ›
            </button>
          </>
        )}

        {(item.isFeatured || item.featured) && (
          <span className="absolute top-3 left-3 bg-[#d4af37] text-black text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
            <img src="../../icons/star_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /> Featured
          </span>
        )}

        <span
          className={`absolute bottom-3 right-3 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md ${
            item.stock > 0
              ? 'bg-black/60 text-[#d4af37] border border-[#d4af37]/30'
              : 'bg-black/60 text-red-400 border border-red-500/30'
          }`}
        >
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
        </span>

        {imagesList.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {imagesList.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-[#d4af37] w-3' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
            {item.name || item.title}
          </h3>

          <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-wider mb-2">
            {[item.category, item.subCategory || item.subcategory, item.brand]
              .filter(Boolean)
              .join(' • ')}
          </p>

          <p className="text-xs text-[#a3a3a3] leading-relaxed mb-4 line-clamp-2">
            {item.description || item.shortDescription}
          </p>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-[#d4af37]">${item.price}</span>
            {(item.discount > 0 || item.discountPrice > 0) && (
              <span className="text-xs font-semibold text-[#d4af37]/70">
                -${item.discount || item.discountPrice} off
              </span>
            )}
          </div>

          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#a3a3a3] text-[10px] px-2 py-0.5 rounded"
                >
                  #{typeof tag === 'object' ? tag.name || tag.label : tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#2a2a2a]">
          <button className="py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
            👁 View
          </button>
          <button className="py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
            ✏ Edit
          </button>
          <button
            onClick={() => onQuickEdit(item)}
            className="py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            ⚡ Quick Edit
          </button>
          <button
            onClick={() => onDelete(item._id || item.id)}
            disabled={isDeleting}
            className="py-2 bg-[#2a1a1a] hover:bg-[#3a1a1a] text-red-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            {isDeleting ? '...' : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;