import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Tag, Folder, ImageOff } from "lucide-react";
import { getProductById } from "../api/productApi";

const FALLBACK_IMAGE =
  "https://placehold.co/600x400/1e293b/94a3b8?text=No+Image+Uploaded";

const extractImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (typeof img === "object") {
    return img.url || img.secure_url || img.path || img.src || null;
  }
  return null;
};

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    getProductById(id)
      .then((res) => {
        setProduct(res.data.product || res.data);
        setSelectedImageIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <p className="text-secondary text-sm">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-bg-main p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <p className="text-primary">Product not found.</p>
      </div>
    );
  }

  const rawImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? Array.isArray(product.image)
        ? product.image
        : [product.image]
      : [];

  const images = rawImages
    .map(extractImageUrl)
    .filter((url) => url && url !== "undefined");

  const displayImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  const activeImage = displayImages[selectedImageIndex] || displayImages[0];

  return (
    <div className="min-h-screen bg-bg-main text-primary">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-2 border-b border-border-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <div className="px-6 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-active" />
          <h1 className="text-lg font-semibold">{product.name}</h1>
        </div>
        <p className="text-xs pl-6 text-secondary">Product details overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 px-6 pb-6 max-w-6xl">
        {/* Gallery Section */}
        <div>
          <div className="rounded-xl overflow-hidden bg-input border border-border-custom aspect-[4/3] flex items-center justify-center">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name || "Product"}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-secondary">
                <ImageOff size={32} className="opacity-40" />
                <p className="text-xs">No image available</p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {displayImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-20 h-16 sm:w-24 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all bg-input ${
                    selectedImageIndex === i
                      ? "border-active"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <div className="rounded-xl p-5 bg-card border border-border-custom">
            <p className="text-sm tracking-wide font-medium mb-1 text-active">
              Overview
            </p>
            <h2 className="text-xl font-semibold mb-2 text-primary">
              {product.name}
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-card border border-border-custom">
              <p className="text-[11px] tracking-wide mb-1 text-secondary">
                Price
              </p>
              <p className="font-semibold text-primary">${product.price ?? 0}</p>
            </div>
            <div className="rounded-xl p-4 bg-card border border-border-custom">
              <p className="text-[11px] tracking-wide mb-1 text-secondary">
                Discount
              </p>
              <p className="font-semibold text-primary">
                ${product.discountPrice ?? product.discount ?? "-"}
              </p>
            </div>
            <div className="rounded-xl p-4 bg-card border border-border-custom">
              <p className="text-[11px] tracking-wide mb-1 text-secondary">
                Stock
              </p>
              <p className="font-semibold text-primary">{product.stock ?? 0}</p>
            </div>
            <div className="rounded-xl p-4 bg-card border border-border-custom">
              <p className="text-[11px] tracking-wide mb-1 text-secondary">
                SKU
              </p>
              <p className="font-semibold text-primary">{product.sku || "-"}</p>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="rounded-xl p-4 bg-card border border-border-custom">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-secondary" />
                <p className="text-[11px] tracking-wide text-secondary">Tags</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag, idx) => (
                  <span
                    key={typeof tag === "string" ? tag : idx}
                    className="text-xs px-3 py-1 rounded-full bg-active/10 text-active"
                  >
                    #{typeof tag === "object" ? tag.name : tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.category && (
            <div className="rounded-xl p-4 bg-card border border-border-custom">
              <div className="flex items-center gap-2 mb-2">
                <Folder size={14} className="text-secondary" />
                <p className="text-[11px] tracking-wide text-secondary">
                  Category Info
                </p>
              </div>
              <p className="text-sm text-secondary">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;