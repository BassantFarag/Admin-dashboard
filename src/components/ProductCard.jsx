import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
const FALLBACK_IMAGE = 'https://placehold.co/600x400/1e293b/94a3b8?text=No+Image+Uploaded';

const ProductCard = ({ item, onQuickEdit, onDelete, isDeleting }) => {
  const navigate = useNavigate();
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
    <div className="group bg-card border border-border-custom rounded-2xl overflow-hidden flex flex-col w-full shadow-lg transition-all duration-300 hover:border-active hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1">
      
      <div className="relative w-full h-[230px] bg-bg-main overflow-hidden">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
            >
              ›
            </button>
          </>
        )}

        {(item.isFeatured || item.featured) && (
          <span className="absolute top-2.5 left-2.5 bg-active text-bg-main text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
            <img src="../../icons/star_25dp_E3B158_FILL0_wght400_GRAD0_opsz24.png" alt="" /> Featured
          </span>
        )}

        <span
          className={`absolute bottom-3 right-3 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md ${
            item.stock > 0
              ? 'bg-black/60 text-active border border-active/30'
              : 'bg-black/60 text-danger border border-danger/30'
          }`}
        >
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
        </span>

        {imagesList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
            {imagesList.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-active w-3' : 'bg-white/40 w-1.5'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">
            {item.name || item.title}
          </h3>

          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">
            {[item.category, item.subCategory || item.subcategory, item.brand]
              .filter(Boolean)
              .join(' • ')}
          </p>

          <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-2">
            {item.description || item.shortDescription}
          </p>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-active">${item.price}</span>
            {(item.discount > 0 || item.discountPrice > 0) && (
              <span className="text-xs font-semibold text-secondary line-through">
                -${item.discount || item.discountPrice} off
              </span>
            )}
          </div>

          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-bg-main border border-border-custom text-secondary text-[10px] px-2 py-0.5 rounded"
                >
                  #{typeof tag === 'object' ? tag.name || tag.label : tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border-custom">
          <button
            onClick={() => navigate(`/products/${item._id || item.id}`)}
            className="py-1.5 bg-input hover:bg-border-custom text-primary rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            👁 View
          </button>
          <button
            onClick={() => navigate(`/products/edit/${item._id || item.id}`)}
            className="py-1.5 bg-input hover:bg-border-custom text-primary rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            ✏ Edit
          </button>
          <button
            onClick={() => onQuickEdit(item)}
            className="py-1.5 bg-input hover:bg-border-custom text-primary rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            ⚡ Quick Edit
          </button>
          <button
            onClick={() => onDelete(item._id || item.id)}
            disabled={isDeleting}
            className="py-1.5 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? '...' : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
