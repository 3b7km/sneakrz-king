import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Plus, Minus, Eye, ShoppingCart } from "lucide-react";
import ProductGallery from "./ProductGallery.jsx";
import { getProductUrl } from "../../utils/urlUtils.js";
import { useCart } from "../../context/CartContext.jsx";

// Optimized ProductCard with lazy loading and performance improvements
const ProductCard = ({
  product,
  onQuickView,
  onAddToCart,
  loadingStates = {},
}) => {
  const { isAF1Product } = useCart();
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.sizes && product.sizes.length > 0) {
      const firstSize = product.sizes[0];
      return typeof firstSize === "object" ? firstSize.value : firstSize;
    }
    return "";
  });
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    await onAddToCart({
      ...product,
      selectedSize,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    await onAddToCart({
      ...product,
      selectedSize,
      quantity,
    });

    // Navigate to checkout
    window.location.href = "/checkout";
  };

  const isLoading = loadingStates[`add-${product.id}`];

  return (
    <div
      ref={cardRef}
      className="product-card-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Optimized Image Gallery with Lazy Loading */}
      <div className="product-image-container relative">
        {isVisible ? (
          <ProductGallery
            images={product.images || [product.image]}
            productName={product.name}
            className="h-80 sm:h-96"
            lazy={true}
          />
        ) : (
          // Skeleton loader while not visible
          <div className="h-80 sm:h-96 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          </div>
        )}

        {/* Status Badges */}
        {product.isNew && (
          <span className="status-badge absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            New
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-4">
        {/* Rating */}
        <div className="rating-stars flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`star w-5 h-5 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600 font-medium">
            ({product.rating})
          </span>
        </div>

        {/* Product Name with AF1 Special Styling */}
        <Link to={getProductUrl(product)}>
          <h3 className={`text-xl font-bold leading-tight line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer ${
            isAF1Product(product.id)
              ? "text-pink-600 bg-gradient-to-r from-pink-100 to-pink-50 px-2 py-1 rounded-md border border-pink-200"
              : "text-gray-900"
          }`}>
            {product.name}
            {isAF1Product(product.id) && (
              <span className="ml-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                AF1 OFFER!
              </span>
            )}
          </h3>
        </Link>

        {/* Brand & Gender */}
        <div className="flex justify-between items-center">
          <p className="text-lg text-gray-600 font-medium">{product.brand}</p>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
            {product.gender}
          </span>
        </div>

        {/* Price Display */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-gray-900">
            {product.price} EGP
          </span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice} EGP
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-semibold">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                )}
                % OFF
              </span>
            </>
          )}
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Category:</span>
            <span>{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Condition:</span>
            <span>{product.condition}</span>
          </div>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => {
                const sizeValue = typeof size === "object" ? size.value : size;
                const isAvailable =
                  typeof size === "object" ? size.available : true;
                return (
                  <button
                    key={`${product.id}-size-${sizeValue}-${index}`}
                    onClick={() => setSelectedSize(sizeValue)}
                    disabled={!isAvailable}
                    className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === sizeValue
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : isAvailable
                          ? "border-gray-300 text-gray-700 hover:border-gray-400"
                          : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed line-through"
                    }`}
                  >
                    {sizeValue}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h4>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center border rounded-md py-2"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border rounded-md hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Link
            to={getProductUrl(product)}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="py-3 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#002b5e" }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className="py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
