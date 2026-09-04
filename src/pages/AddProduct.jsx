import { useState, useEffect, useRef } from "react";
import { ImagePlus, X, Sparkles } from "lucide-react";
import axios from "axios";
import { createProduct } from "../api/productApi";
import AddProductForm from "../components/addProductForm";
import AddProductHeader from "../components/AddProductHeader";
import iphoneImage from "../images/iphone_air__b5qmgl05ojyq_large.jpg";


const AddProduct = () => {
  const [images, setImages] = useState([]);

    const productTips = [
    "High-quality photos from multiple angles increase buyer trust.",
    "Products with 3+ tags get discovered more often in search.",
    "Setting a discount price automatically shows a sale badge.",
    "Clear, specific product names rank higher than generic ones.",
  ];

  const [tipIndex, setTipIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tipCardRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % productTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTiltMove = (e) => {
    const card = tipCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    setTilt({ x, y });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Image upload handler
  const changeFile = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      alert("Sorry, you can upload no more than 5 photos of the product!");
    }

    setImages((prevImages) => [...prevImages, ...selectedFiles].slice(0, 5));
    e.target.value = "";
  };

  // Delete image handler
  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle CreateProduct function with API Integration
  const handleCreateProduct = async (formData) => {
    try {
      const body = new FormData();

    
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value === undefined || value === null || value === "") return;
        if (key === "tags" && Array.isArray(value)) {
          value.forEach((tag) => body.append("tags", tag));
        } else {
        body.append(key, value);
      }
      });

      // integrate images into the FormData
      images.forEach((img) => {
        body.append("images", img);
      });

      // Send the data to the API
     const response = await createProduct(body);

     
      alert("Product created successfully!");

   
      setImages([]);
    } catch (error) {
     console.error("Error creating product:", error.response?.data || error.message);
      alert("Failed to create product!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-main p-4 sm:p-6 text-primary">
      <AddProductHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        
        {/* Left Column: Gallery */}
        <section className="lg:col-span-5 bg-card border border-border-custom p-4 sm:p-6 rounded-3xl shadow-xl space-y-6">
          
          {/* Header */}
          <div className="flex gap-3 sm:gap-4 items-center">
            <div className="shrink-0 text-warning bg-warning/10 p-2.5 sm:p-3 rounded-2xl">
              <ImagePlus size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-primary font-bold text-base sm:text-lg">Gallery</h2>
              <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                Upload multiple images and preview instantly.
              </p>
            </div>
          </div>

          {/* Images Display */}
          {images.length === 0 ? (
            <div className="w-full">
              <article className="bg-input rounded-2xl border border-border-custom shadow-sm overflow-hidden">
                <div className="h-60 sm:h-72 w-full bg-card flex flex-col items-center justify-center gap-2 text-secondary">
                  <ImagePlus size={40} className="opacity-40" />
                  <p className="text-sm font-medium opacity-60">No Image Selected</p>
                </div>
                <div className="px-3 sm:px-4 py-3 text-xs uppercase text-secondary tracking-widest font-medium">
                   IMAGES PREVIEW
                </div>
              </article>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
              {images.map((image, index) => (
                <article
                  key={index}
                  className="group relative bg-input rounded-2xl border border-border-custom shadow-sm overflow-hidden"
                >
                  <div className="h-40 sm:h-48 w-full bg-card">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteImage(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-2 right-2 bg-card/80 hover:bg-danger text-primary p-1.5 rounded-full shadow-md backdrop-blur-sm cursor-pointer"
                  >
                    <X size={16} />
                  </button>

                  <div className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs uppercase text-secondary tracking-widest truncate font-medium">
                    IMAGE {index + 1}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Upload Box */}
          <label className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 p-5 sm:p-8 cursor-pointer rounded-3xl border-2 border-warning border-dashed bg-warning/10 text-primary transition-all duration-200 hover:bg-warning/20">
            <ImagePlus className="size-6 text-warning" />

            <p className="text-sm sm:text-base font-semibold text-primary">
              Upload images
            </p>

            <p className="text-[10px] sm:text-sm text-secondary">
              PNG, JPG, WEBP • multiple files supported
            </p>

            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              onChange={changeFile}
            />
          </label>

          {/* Senior UX Note */}
          {/* Product Tips - animated 3D card */}
<div
  ref={tipCardRef}
  onMouseMove={handleTiltMove}
  onMouseLeave={resetTilt}
  style={{
    transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: "transform 0.15s ease-out",
  }}
  className="relative text-warning bg-warning/10 p-4 sm:p-5 border border-warning/30 rounded-3xl overflow-hidden"
>
  <div className="flex items-center gap-3">
    <div
      className="shrink-0 bg-warning/20 p-2.5 rounded-2xl"
      style={{ animation: "floatIcon 3s ease-in-out infinite" }}
    >
      <Sparkles size={20} />
    </div>
    <h2 className="font-bold text-base sm:text-lg">Product Tips</h2>
  </div>

  <div className="relative h-12 mt-3 overflow-hidden">
    {productTips.map((tip, idx) => (
      <p
        key={idx}
        className="absolute inset-0 text-xs sm:text-sm leading-relaxed text-secondary"
        style={{
          opacity: idx === tipIndex ? 1 : 0,
          transform: idx === tipIndex ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {tip}
      </p>
    ))}
  </div>

  <div className="flex gap-1.5 mt-3">
    {productTips.map((_, idx) => (
      <div
        key={idx}
        className="h-1 rounded-full transition-all duration-300"
        style={{
          width: idx === tipIndex ? "16px" : "6px",
          backgroundColor: idx === tipIndex ? "currentColor" : "currentColor",
          opacity: idx === tipIndex ? 1 : 0.3,
        }}
      />
    ))}
  </div>

  <style>{`
    @keyframes floatIcon {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }
  `}</style>
</div>
        </section>

        {/* Right Column: Form */}
        <section className="lg:col-span-7">
          <AddProductForm onSubmitProduct={handleCreateProduct} />
        </section>

      </div>
    </div>
  );
};

export default AddProduct;