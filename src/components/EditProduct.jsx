import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductById } from "../api/productApi";

const EditProduct = ({ id }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  // fetch product images
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);

        setExistingImages(response.data.images || []);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // add new images
  const changeFile = (e) => {
    const files = Array.from(e.target.files);

    setImages((prevImages) =>
      [...prevImages, ...files].slice(0, 5 - existingImages.length)
    );

    e.target.value = "";
  };

  // Mark to remove
  const toggleRemoveImage = (type, index) => {
    const imageId = `${type}-${index}`;

    setImagesToRemove((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      }

      return [...prev, imageId];
    });
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
              Product Gallery
            </h2>

            <p className="text-secondary text-xs sm:text-sm leading-relaxed">
              Keep existing images, add new ones, or remove selected assets
              before saving.
            </p>
          </div>
        </div>

        {/* Product Images */}
        <div className="mt-2 sm:mt-6 w-full">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">

            {/* Existing product images */}
            {existingImages.map((image, index) => {
              const imageId = `existing-${index}`;
              const markedForRemove = imagesToRemove.includes(imageId);

              return (
                <article
                  key={`existing-${index}`}
                  className="min-w-0 group relative dark:bg-black rounded-2xl border border-border-custom shadow-sm overflow-hidden"
                >

                  {/* Product Image */}
                  <div className="h-48 w-full sm:h-64 md:h-80 bg-card">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Remove Image Button */}
                  <button
                    type="button"
                    onClick={() => toggleRemoveImage("existing", index)}
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 cursor-pointer p-1.5 sm:p-2 rounded-full shadow-md transition-opacity duration-500 ${markedForRemove ? "bg-red-500 text-white opacity-100" : "bg-card text-red-400 opacity-0 group-hover:opacity-100"}`}
                  >
                    <Trash2 size={16} className="sm:size-4" />
                  </button>

                  {/* Image Label */}
                  <div className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs uppercase text-secondary tracking-[0.15em] sm:tracking-[0.25em] truncate">
                    {markedForRemove ? "Mark to remove" : `Image ${index + 1}`}
                  </div>
                </article>
              );
            })}

            {images.map((image, index) => {
              const imageId = `new-${index}`;
              const markedForRemove = imagesToRemove.includes(imageId);

              return (
                <article
                  key={`new-${index}`}
                  className="min-w-0 group relative bg-black rounded-2xl border border-border-custom shadow-sm overflow-hidden"
                >

                  <div className="h-48 w-full sm:h-64 md:h-80 bg-card">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRemoveImage("new", index)}
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 cursor-pointer p-1.5 sm:p-2 rounded-full shadow-md transition-opacity duration-500 ${markedForRemove ? "bg-red-500 text-white opacity-100" : "bg-card text-red-400 opacity-0 group-hover:opacity-100"}`}
                  >
                    <Trash2 size={16} className="sm:size-4" />
                  </button>

                  {/* image label */}
                  <div className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs uppercase text-secondary tracking-[0.15em] sm:tracking-[0.25em] truncate">
                    {markedForRemove
                      ? "Mark to remove"
                      : `Image ${existingImages.length + index + 1}`}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* add new images */}
        <label className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 p-5 sm:p-8 cursor-pointer rounded-3xl border-2 border-warning border-dashed bg-warning/10 text-primary transition-all duration-200 hover:bg-warning/20">
          <ImagePlus className="size-6 text-warning" />

          <p className="text-sm sm:text-base text-secondary dark:text-white capitalize">
            Add more images
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

        {/* senior UX */}
        <div className="text-warning bg-warning/10 p-4 sm:p-5 border border-warning rounded-3xl space-y-2 transition-all duration-200 hover:bg-warning/20">
          <h2 className="font-bold text-base sm:text-lg">
            Senior UX
          </h2>

          <p className="tracking-wide text-xs sm:text-sm leading-relaxed dark:text-warning/70">
            Optimized product creation experience with responsive design and
            smooth interactions.
          </p>
        </div>

      </section>
    </div>
  );
};

export default EditProduct;