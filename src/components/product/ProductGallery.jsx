import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductGallery = ({
  images = [],
  productName = "Product",
  className = "h-64",
  lazy = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Preload images for better performance
  useEffect(() => {
    if (!lazy && images.length > 0) {
      images.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
          });
          if (index === currentImageIndex) {
            setIsLoading(false);
          }
        };
        img.src = src;
      });
    }
  }, [images, lazy, currentImageIndex]);

  // Handle lazy loading
  useEffect(() => {
    if (lazy && images.length > 0) {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => {
          const newSet = new Set(prev);
          newSet.add(currentImageIndex);
          return newSet;
        });
        setIsLoading(false);
      };
      img.src = images[currentImageIndex];
    }
  }, [currentImageIndex, images, lazy]);

  const nextImage = () => {
    setIsLoading(true);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setIsLoading(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToImage = (index) => {
    setIsLoading(true);
    setCurrentImageIndex(index);
  };

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className} group overflow-hidden bg-gray-100`}>
      {/* Main Image */}
      <div
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loadedImages.has(currentImageIndex) ? "opacity-100" : "opacity-0"
          }`}
          loading={lazy ? "lazy" : "eager"}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-md text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Loading Progress for lazy loading */}
      {lazy && isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div className="h-full bg-blue-500 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
