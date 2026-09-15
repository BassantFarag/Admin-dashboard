import { ImagePlus, Trash2, ImageOff, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

// Product images from the API can arrive as plain URL strings or as
// objects (e.g. Cloudinary-style { url, secure_url }). Normalize here so
// a mismatch in shape never silently breaks the <img> src.
const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secure_url || image.path || image.src || "";
};

const EditProductPhoto = ({ id, existingImages: initialImages = [] }) => {
  const [existingImages, setExistingImages] = useState(initialImages);
  const [images, setImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [brokenImages, setBrokenImages] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayReady, setDisplayReady] = useState(true);

  // Keep in sync if the parent's product data arrives/changes after mount
  // (e.g. the fetch in EditProductPage resolves slightly after first render).
  useEffect(() => {
    if (initialImages.length) {
      setExistingImages(initialImages);
    }
  }, [initialImages]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mark to remove (this is what gets sent to the server on Save — the
  // image only disappears from the server once Save Changes is pressed).
  const toggleRemoveImage = (type, index) => {
    if (type === "existing") {
      const imageId = `existing-${index}`;
      setImagesToRemove((prev) =>
        prev.includes(imageId)
          ? prev.filter((entryId) => entryId !== imageId)
          : [...prev, imageId]
      );
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Existing images the user hasn't marked for removal, plus any freshly
  // uploaded ones — this is what the slider actually navigates through.
  const visibleItems = useMemo(() => {
    const existing = existingImages
      .map((image, index) => {
        const imageId = `existing-${index}`;
        return {
          key: imageId,
          type: "existing",
          index,
          url: getImageUrl(image),
          marked: imagesToRemove.includes(imageId),
          label: `Image ${index + 1}`,
        };
      })
      .filter((item) => !item.marked);

    const fresh = images.map((file, index) => ({
      key: `new-${index}`,
      type: "new",
      index,
      url: URL.createObjectURL(file),
      marked: false,
      label: `New image ${existingImages.length + index + 1}`,
    }));

    return [...existing, ...fresh];
  }, [existingImages, images, imagesToRemove]);

  // Existing images marked for removal — kept visible in a small strip so
  // removing one is reversible until Save Changes is actually pressed.
  const removedItems = useMemo(
    () =>
      existingImages
        .map((image, index) => ({
          key: `existing-${index}`,
          index,
          url: getImageUrl(image),
          label: `Image ${index + 1}`,
        }))
        .filter((item) => imagesToRemove.includes(item.key)),
    [existingImages, imagesToRemove]
  );

  // Keep the active slide in range whenever the list changes.
  useEffect(() => {
    if (activeIndex > visibleItems.length - 1) {
      setActiveIndex(Math.max(0, visibleItems.length - 1));
    }
  }, [visibleItems.length, activeIndex]);

  const goTo = (nextIndex) => {
    if (nextIndex === activeIndex || nextIndex < 0 || nextIndex > visibleItems.length - 1) return;
    setDisplayReady(false);
    window.setTimeout(() => {
      setActiveIndex(nextIndex);
      requestAnimationFrame(() => setDisplayReady(true));
    }, 150);
  };

  const goNext = () => goTo((activeIndex + 1) % visibleItems.length);
  const goPrev = () => goTo((activeIndex - 1 + visibleItems.length) % visibleItems.length);

  // add new images
  const changeFile = (e) => {
    const files = Array.from(e.target.files);

    setImages((prevImages) =>
      [...prevImages, ...files].slice(0, 5 - existingImages.length)
    );

    e.target.value = "";
  };

  const current = visibleItems[activeIndex];

  return (
    <div
      className={`w-full min-w-0 transition-all duration-500 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <section className="flex flex-col w-full min-w-0 bg-card border-bg-main space-y-6 p-4 sm:p-6 rounded-3xl sm:rounded-4xl shadow-xl">

        {/* Header */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="shrink-0 text-amber-400 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-amber-400/20 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl">
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

        {/* Slider */}
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border border-dashed border-border-custom text-center">
            <ImagePlus className="size-8 text-secondary/40" />
            <p className="text-sm text-secondary">No images uploaded yet</p>
          </div>
        ) : (
          <div className="w-full">
            {/* Main display */}
            <div className="relative w-full aspect-square rounded-2xl border border-border-custom shadow-sm overflow-hidden dark:bg-black">
              {current?.url && !brokenImages.includes(current.key) ? (
                <img
                  src={current.url}
                  alt={current.label}
                  onError={() =>
                    setBrokenImages((prev) => [...prev, current.key])
                  }
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    displayReady ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] text-secondary/50">
                  <ImageOff size={28} />
                  <span className="text-[11px] uppercase tracking-wider">
                    Unavailable
                  </span>
                </div>
              )}

              {/* Legibility gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0" />

              {/* Prev / Next */}
              {visibleItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-amber-500 hover:text-black transition-all duration-200"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-amber-500 hover:text-black transition-all duration-200"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Remove current image */}
              <button
                type="button"
                onClick={() => toggleRemoveImage(current.type, current.index)}
                aria-label="Remove this image"
                className="absolute top-3 right-3 p-2 rounded-full shadow-md bg-black/50 text-white hover:bg-red-500 transition-all duration-300"
              >
                <Trash2 size={16} />
              </button>

              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 px-3 py-2.5 text-xs uppercase text-white/90 tracking-[0.2em] truncate bg-gradient-to-t from-black/70 to-transparent">
                {current.label}
              </div>
            </div>

            {/* Dots */}
            {visibleItems.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {visibleItems.map((item, i) => (
                  <button
                    key={item.key}
                    type="button"
                    aria-label={`Go to ${item.label}`}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-6 bg-amber-400"
                        : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail strip */}
            {visibleItems.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {visibleItems.map((item, i) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      i === activeIndex
                        ? "border-amber-400 scale-105"
                        : "border-border-custom opacity-70 hover:opacity-100"
                    }`}
                  >
                    {item.url && !brokenImages.includes(item.key) ? (
                      <img
                        src={item.url}
                        alt={item.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-white/5 text-secondary/40">
                        <ImageOff size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Marked-for-removal strip — reversible until Save Changes */}
        {removedItems.length > 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-[11px] uppercase tracking-wider text-red-400/90 font-bold mb-2">
              Marked for removal &middot; will be deleted on save
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {removedItems.map((item) => (
                <div
                  key={item.key}
                  className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-red-500/30"
                >
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.label}
                      className="h-full w-full object-cover opacity-40"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-white/5 text-secondary/40 opacity-40">
                      <ImageOff size={14} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleRemoveImage("existing", item.index)}
                    aria-label={`Restore ${item.label}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors duration-200"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* add new images */}
        <label className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 p-5 sm:p-8 cursor-pointer rounded-3xl border-2 border-amber-500/40 border-dashed bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent text-primary transition-all duration-300 hover:border-amber-400 hover:from-amber-500/15 hover:via-orange-500/10 hover:scale-[1.01]">
          <ImagePlus className="size-6 text-amber-400" />

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

      </section>
    </div>
  );
};

export default EditProductPhoto;