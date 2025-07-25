import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductGallery = ({ images, productName, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        prevImage();
      } else if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`product-gallery ${className}`}>
      {/* Main Image Display */}
      <div className="relative mb-4">
        {failedImages.has(currentIndex) ? (
          <div className="w-full h-80 sm:h-96 lg:h-[500px] bg-gray-50 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-lg">Image not available</div>
              <div className="text-sm">{productName}</div>
            </div>
          </div>
        ) : (
          <img
            src={images[currentIndex]}
            alt={`${productName} - View ${currentIndex + 1} of ${images.length}`}
            className="w-full h-80 sm:h-96 lg:h-[500px] object-contain bg-gray-50 rounded-xl"
            loading="lazy"
            onError={(e) => {
              // Try to fix common path issues
              const originalSrc = e.target.src;
              if (originalSrc.includes("./Sneakers photos/")) {
                e.target.src = originalSrc.replace(
                  "./Sneakers photos/",
                  "/Sneakers photos/",
                );
              } else {
                // Mark image as failed for React to handle
                setFailedImages((prev) => new Set([...prev, currentIndex]));
              }
            }}
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Count Indicator */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {failedImages.has(index) ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">❌</span>
                </div>
              ) : (
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Try to fix path issues for thumbnails
                    const originalSrc = e.target.src;
                    if (originalSrc.includes("./Sneakers photos/")) {
                      e.target.src = originalSrc.replace(
                        "./Sneakers photos/",
                        "/Sneakers photos/",
                      );
                    } else {
                      setFailedImages((prev) => new Set([...prev, index]));
                    }
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
