import React, { useState, useEffect } from 'react';
import ProductHeader from '../components/ProductHeader';
import ProductForm from '../components/ProductForm';

export default function EditProductPage() {
  const [isDark, setisDark] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  
  const [apiData, setApiData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    sku: '',
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

  // 3. API
  useEffect(() => {
    const responseData = {
      "success": true,
      "product": {
        "name": "Porsche GT3 (992) – Midnight Gloss Edition",
        "shortDescription": "NUOVI Kit di Carene in ABS Adatti",
        "description": "NUOVI Kit di Carene in ABS Adatti per YAMAHA R6 2017 2018 2019 2020 2021 2022 2023 Set Carrozzeria",
        "price": 14500000,
        "discountPrice": 13000000,
        "stock": 9,
        "sku": "32316",
        "category": "sport",
        "subcategory": "motor",
        "brand": "2026",
        "tags": ["porsche", "track car", "gt3"],
        "isActive": true,

      }
    };

    if (responseData.success) {
      setApiData(responseData.product);
      setFormData({
        name: responseData.product.name,
        price: responseData.product.price,
        discountPrice: responseData.product.discountPrice,
        stock: responseData.product.stock,
        sku: responseData.product.sku,
        subcategory: responseData.product.subcategory,
        category: responseData.product.category,
        shortDescription: responseData.product.shortDescription,
        description: responseData.product.description,
      });
    }
  }, []);

  if (!apiData) {
    return (
      <div className={`p-10 text-center font-bold h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e10] text-[#f2f2f0]' : 'bg-[#f8f8f6] text-[#0d0e10]'
      }`}>
        Loading product data...
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
        />

      </div>
    </div>
  );
}
