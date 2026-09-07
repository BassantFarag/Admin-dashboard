import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import ProductHeader from '../components/ProductHeader';
import ProductForm from '../components/ProductForm';
import * as apiService from '../api/axios';


export default function EditProductPage() {
  const { id } = useParams(); 
  
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
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
       
        const response = await apiService.getProductById(id);

        
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
        const response = await apiService.updateProduct(id, formData);

      
      if (response?.data?.success || response?.status === 200) {
        alert("Changes saved and updated in the database successfully!");
      }
    } catch (error) {
      console.error("An error occurred while connecting to the server to update the product:", error);
      alert("Failed to save changes to the server. Please try again.");    }
  };

  if (loading) {
    return (
      <div className={`p-10 text-center font-bold h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e10] text-[#f2f2f0]' : 'bg-[#f8f8f6] text-[#0d0e10]'
      }`}>
        <div className="space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e3b158] mx-auto"></div>
          <p className="text-sm tracking-wide">Fetching product details from Live API...</p>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className={`p-10 text-center font-bold h-screen flex items-center justify-center ${
        isDark ? 'bg-[#0d0e10] text-[#c9c8c3]' : 'bg-[#f8f8f6] text-[#3a3b3e]'
      }`}>
        No product data available
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-10 font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0d0e10]' : 'bg-[#f8f8f6]'
    }`} dir="ltr">
      
      <ProductHeader 
        isActive={apiData.isActive} 
        handleBack={() => window.history.back()} 
        isDark={isDark}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gallery Space */}
        <div className={`lg:col-span-1 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
          isDark ? 'bg-[#161719] border border-[#2a2b2e]' : 'bg-[#faf9f5] border border-[#e3b158]/50'
        }`}>
          <p className={`text-sm font-semibold transition-colors ${isDark ? 'text-[#f2f2f0]' : 'text-[#3a3b3e]'}`}>
            Product Gallery
          </p>
          <div className={`h-48 border border-dashed rounded-xl flex items-center justify-center text-xs mt-4 transition-colors ${
            isDark ? 'border-[#2a2b2e] bg-[#0d0e10] text-[#c9c8c3]/60' : 'border-[#e3b158]/30 bg-white/50 text-[#3a3b3e]/60'
          }`}>
            [ Gallery Space ]
          </div>
        </div>

        <ProductForm 
          formData={formData} 
          setFormData={setFormData} 
          tags={apiData.tags} 
          isDark={isDark}
          onSubmit={handleSaveChanges}
        />

      </div>
    </div>
  );
}
