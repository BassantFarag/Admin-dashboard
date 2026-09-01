import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Tag, Folder, Star } from "lucide-react";
import { getProductById } from "../api/productApi";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    getProductById(id)
      .then((res) => {
        setProduct(res.data.product || res.data);
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
      <div className="p-6">
        <p className="dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#8A8A8A] dark:text-[#9A9A9A] hover:opacity-70 transition-opacity mb-4"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <p className="dark:text-white">Product not found.</p>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://i.pinimg.com/736x/b5/fb/43/b5fb430848547af9f86917f197f47b95.jpg"];

  return (
    <div className="min-h-screen font-sans transition-colors bg-[#f0e9e3] text-[#1A1A1A] dark:bg-[#181818] dark:text-[#EDEDED] rounded-2xl">
      <div className="px-6 pt-4 pb-2 border-b border-[#ECECEC] dark:border-[#2A2A2A]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#8A8A8A] dark:text-[#9A9A9A] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <div className="px-6 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-[#B8935A] dark:text-[#D6B77A]" />
          <h1 className="text-lg font-semibold">{product.name}</h1>
        </div>
        <p className="text-xs pl-6 text-[#9A9A9A] dark:text-[#8A8A8A]">
          Product details overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 px-6 pb-6 max-w-6xl mx-auto">
        <div>
          <div className="rounded-xl overflow-hidden bg-black">
            <img
              src={images[0]}
              alt="Product"
              className="w-full h-[420px] object-cover"
            />
          </div>
          <div className="flex gap-3 mt-5 mb-3">
            {images.map((src, i) => (
              <button
                key={i}
                className="w-24 h-20 rounded-lg overflow-hidden border-2 border-transparent first:border-[#B8935A] dark:first:border-[#D6B77A] transition-colors"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-5 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
            <p className="text-[16px] tracking-wide font-medium mb-1 text-[#593e15] dark:text-[#D6B77A]">
              Overview
            </p>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-sm leading-relaxed text-[#555] dark:text-[#C7C7C7]">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
              <p className="text-[11px] tracking-wide mb-1 text-[#9A9A9A] dark:text-[#8A8A8A]">
                Price
              </p>
              <p className="font-semibold">${product.price}</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
              <p className="text-[11px] tracking-wide mb-1 text-[#9A9A9A] dark:text-[#8A8A8A]">
                Discount
              </p>
              <p className="font-semibold">${product.discountPrice ?? product.discount ?? "-"}</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
              <p className="text-[11px] tracking-wide mb-1 text-[#9A9A9A] dark:text-[#8A8A8A]">
                Stock
              </p>
              <p className="font-semibold">{product.stock}</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
              <p className="text-[11px] tracking-wide mb-1 text-[#9A9A9A] dark:text-[#8A8A8A]">
                SKU
              </p>
              <p className="font-semibold">{product.sku || "-"}</p>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="rounded-xl p-4 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-[#9A9A9A] dark:text-[#8A8A8A]" />
                <p className="text-[11px] tracking-wide text-[#9A9A9A] dark:text-[#8A8A8A]">
                  Tags
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-[#F5EFE0] text-[#8A6B2E] dark:bg-[#2A2A2A] dark:text-[#D6B77A]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.category && (
            <div className="rounded-xl p-4 bg-white border border-[#ECECEC] dark:bg-[#212121] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <Folder size={14} className="text-[#9A9A9A] dark:text-[#8A8A8A]" />
                <p className="text-[11px] tracking-wide text-[#9A9A9A] dark:text-[#8A8A8A]">
                  Category Info
                </p>
              </div>
              <p className="text-sm text-[#555] dark:text-[#C7C7C7]">
                {product.category}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;