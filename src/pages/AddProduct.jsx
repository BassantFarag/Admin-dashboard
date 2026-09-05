import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import iphoneImage from "../images/iphone_air__b5qmgl05ojyq_large.jpg";

const AddProduct = () => {
  const [images, setImages] = useState([]);

  const changeFile = (e) => {
    const files = Array.from(e.target.files);

    setImages((prevImages) => [...prevImages, ...files].slice(0, 5));
  };

  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full min-w-0">
      <section className="flex flex-col w-1/2 min-w-0 min-h-screen bg-card border-bg-main space-y-6 p-4 sm:p-6 rounded-3xl sm:rounded-4xl shadow-xl">
        {/* Header */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="shrink-0 text-warning bg-warning/10 p-2.5 sm:p-3 rounded-2xl">
            <ImagePlus size={22} className="sm:w-6 sm:h-6" />
          </div>

          <div className="min-w-0">
            <h2 className="text-primary font-bold text-base sm:text-lg">
              Gallery
            </h2>

            <p className="text-secondary text-xs sm:text-sm leading-relaxed">
              Upload multiple images and preview instantly.
            </p>
          </div>
        </div>

        {/* Images */}
        {images.length === 0 ? (
          <div className="mt-2 sm:mt-6 w-full">
            <article className="w-1/2 dark:bg-black rounded-2xl border border-border-custom shadow-sm overflow-hidden">
              <div className="h-60 sm:h-80 w-full bg-card">
                <img src={iphoneImage} alt="iPhone air" className="h-full w-full object-cover" />
              </div>

              <div className="px-3 sm:px-4 py-3 text-xs uppercase text-secondary tracking-[0.2em] sm:tracking-[0.25em]">
                Image 1
              </div>
            </article>
          </div>
        ) : (
          <div className="mt-2 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-4 w-full">
            {images.map((image, index) => (
              <article key={index} className="min-w-0 bg-black group relative rounded-2xl border border-border-custom shadow-sm overflow-hidden">
                {/* Image */}
                <div className="h-48 w-full sm:h-64 md:h-80 bg-card">
                  <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
                </div>

                {/* Delete image */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button type="button" onClick={() => deleteImage(index)} className="cursor-pointer absolute top-2 right-2 sm:top-4 sm:right-4 bg-card p-1.5 sm:p-2 rounded-full shadow-md">
                    <X size={16} className="sm:size-4" />
                  </button>
                </div>

                {/* Image Label */}
                <div className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs uppercase text-secondary tracking-[0.15em] sm:tracking-[0.25em] truncate">
                  Image {index + 1}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Upload Images */}
        <label className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 p-5 sm:p-8 cursor-pointer rounded-3xl border-2 border-warning border-dashed bg-warning/10 text-primary transition-all duration-200 hover:bg-warning/20">
          <ImagePlus className="size-6 text-warning" />

          <p className="text-sm sm:text-base text-secondary dark:text-white">
            Upload images
          </p>

          <p className="text-[10px] sm:text-sm text-secondary">
            PNG, JPG, WEBP • multiple files supported
          </p>

          <input hidden type="file" accept="image/*" multiple onChange={changeFile} />
        </label>

        {/* Senior UX */}
        <div className="text-warning bg-warning/10 p-4 sm:p-5 border border-warning rounded-3xl space-y-2 transition-all duration-200 hover:bg-warning/20">
          <h2 className="font-bold text-base sm:text-lg">Senior UX</h2>

          <p className="tracking-wide text-xs sm:text-sm leading-relaxed dark:text-warning/70">
            Optimized product creation experience with responsive design and
            smooth interactions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AddProduct;