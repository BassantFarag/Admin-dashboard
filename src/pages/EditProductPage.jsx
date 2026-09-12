import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import ProductHeader from '../components/ProductHeader';
import ProductForm from '../components/ProductForm';
import Loading from '../components/Loading';
import EditProductPhoto from '../components/EditProductPhoto';

import { getProductById, updateProduct } from '../api/productApi';

export default function EditProductPage() {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      console.log("Connected Successfully! Product ID is:", id);
    }
  }, [id]);

  const [isDark, setisDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    sku: '',
    subcategory: '',
    category: '',
    shortDescription: '',
    description: '',
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setisDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const response = await getProductById(id);
        const product = response?.data?.product || response?.data;

        if (product) {
          setApiData(product);
          setFormData({
            name: product.name || '',
            price: product.price || 0,
            discountPrice: product.discountPrice || 0,
            stock: product.stock || 0,
            sku: product.sku || product.spku || '',
            subcategory: product.subcategory || '',
            category: product.category || '',
            shortDescription: product.shortDescription || '',
            description: product.description || '',
          });
        }
      } catch (error) {
        console.error("An error occurred while fetching product data from the Live API:", error);
        alert("Failed to fetch product data from the server. Please check the URL and the ID.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    } else {
      setLoading(false);
      console.warn("Warning: No ID available in the browser URL to connect to the Live API.");
    }
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      console.log("Sending updated data to the database...", formData);

      const response = await updateProduct(id, formData);
      if (response?.data?.success || response?.status === 200) {
        alert("Changes saved and updated in the database successfully!");
      }
    } catch (error) {
      console.error("An error occurred while connecting to the server to update the product:", error);
      alert("Failed to save changes to the server. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!apiData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${
          isDark ? 'bg-[#0d0e10]' : 'bg-[#f8f8f6]'
        }`}
        dir="ltr"
      >
        <div
          className={`w-full max-w-md rounded-2xl border shadow-xl backdrop-blur-md py-16 px-8 text-center ${
            isDark
              ? 'border-white/10 bg-white/[0.03]'
              : 'border-black/10 bg-white'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <PackageSearch
              className={`w-12 h-12 stroke-[1.5] ${
                isDark ? 'text-white/30' : 'text-black/25'
              }`}
            />
            <p className={`text-base font-semibold ${isDark ? 'text-[#c9c8c3]' : 'text-[#3a3b3e]'}`}>
              No product data available
            </p>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              Please verify the product ID and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e10]' : 'bg-[#f8f8f6]'
      }`}
      dir="ltr"
    >
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        {/* Eyebrow + Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-amber-400/80' : 'text-amber-600/90'
              }`}
            >
              Products &middot; Edit
            </p>
          </div>
        </div>

        <ProductHeader
          isActive={apiData.isActive}
          handleBack={() => window.history.back()}
          isDark={isDark}
        />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Gallery panel — EditProductPhoto is already a self-contained
              card (its own background, border, radius and header), so it
              sits directly in the grid instead of inside a second card. */}
          <div className="lg:col-span-1">
            <EditProductPhoto id={id} existingImages={apiData.images || []} />
          </div>

          {/* Form panel */}
          <div
            className={`lg:col-span-2 rounded-2xl border shadow-xl backdrop-blur-md overflow-hidden ${
              isDark
                ? 'border-white/10 bg-white/[0.03]'
                : 'border-black/10 bg-white'
            }`}
          >
            <div className="p-5 md:p-6">
              <h2
                className={`text-sm font-bold uppercase tracking-wider mb-4 ${
                  isDark ? 'text-white/50' : 'text-black/50'
                }`}
              >
                Product Details
              </h2>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                tags={apiData.tags}
                isDark={isDark}
                onSubmit={handleSaveChanges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}