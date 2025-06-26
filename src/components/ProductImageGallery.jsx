import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductImageGallery.css";

const ProductImageGallery = ({
  images = [],
  alt = "",
  className = "",
  showThumbnails = true,
  aspectRatio = "aspect-square",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onPrevButtonClick = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  // Set up embla event listeners
  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  // If no images provided, return placeholder
  if (!images.length) {
    return (
      <div
        className={`${className} ${aspectRatio} bg-gray-200 flex items-center justify-center rounded-lg`}
      >
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
    );
  }

  // If only one image, show simple image without carousel controls
  if (images.length === 1) {
    return (
      <div className={`${className} ${aspectRatio} overflow-hidden rounded-lg`}>
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`product-image-gallery ${className}`}>
      {/* Main Image Carousel */}
      <div className="relative">
        <div
          className={`embla ${aspectRatio} overflow-hidden rounded-lg`}
          ref={emblaMainRef}
        >
          <div className="embla__container flex">
            {images.map((image, index) => (
              <div className="embla__slide flex-shrink-0 w-full" key={index}>
                <img
                  src={image}
                  alt={`${alt} - View ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4">
          <div className="embla-thumbs overflow-hidden" ref={emblaThumbsRef}>
            <div className="embla__container flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`embla__slide-thumb flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedIndex
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  type="button"
                  onClick={() => onThumbClick(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
