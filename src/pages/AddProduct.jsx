import { useState } from "react";
import { ImagePlus, X, Sparkles } from "lucide-react";
import AddProductForm from "../components/addProduct";
import iphoneImage from "../images/iphone_air__b5qmgl05ojyq_large.jpg";

const AddProduct = () => {
  const [images, setImages] = useState([]);

  const changeFile = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files].slice(0, 5));
  };

  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // دالة الإضافة النهائية
  const handleCreateProduct = (formData) => {
    const completeProductData = {
      ...formData,
      images: images, // دمج الصور المرفوعة مع بيانات الفورم
    };

    console.log("المنتج النهائي جاهز للإرسال للـ API:", completeProductData);

    // مثال لإرسال البيانات للـ Backend باستعمال axios أو fetch:
    /*
    const body = new FormData();
    Object.keys(formData).forEach(key => body.append(key, formData[key]));
    images.forEach(img => body.append('images', img));

    await axios.post('/api/products', body);
    */
    
    alert("تم تجميع كائن المنتج بنجاح! راجعي الـ Console للتحقق من البيانات.");
  };

  return (
    <div className="w-full min-h-screen bg-bg-main p-4 sm:p-6 text-primary">
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
                <div className="h-60 sm:h-72 w-full bg-card">
                  <img
                    src={iphoneImage}
                    alt="iPhone air"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-3 sm:px-4 py-3 text-xs uppercase text-secondary tracking-widest font-medium">
                  IMAGE 1
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
          <div className="text-warning bg-warning/10 p-4 sm:p-5 border border-warning/30 rounded-3xl space-y-2 transition-all duration-200 hover:bg-warning/20">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <h2 className="font-bold text-base sm:text-lg">Senior UX</h2>
            </div>

            <p className="tracking-wide text-xs sm:text-sm leading-relaxed text-secondary">
              Optimized product creation experience with responsive design and smooth interactions.
            </p>
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