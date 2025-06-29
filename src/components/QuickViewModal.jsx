import { useState, useEffect } from "react";
import { X, Star, ShoppingCart } from "lucide-react";

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  loadingStates = {},
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product) {
      // Use the selected size from product if available, otherwise find first available
      if (product.selectedSize) {
        setSelectedSize(product.selectedSize);
      } else {
        const firstAvailableSize = product.sizes?.find((size) => {
          return typeof size === "object" ? size.available : true;
        });
        if (firstAvailableSize) {
          const sizeValue =
            typeof firstAvailableSize === "object"
              ? firstAvailableSize.value
              : firstAvailableSize;
          setSelectedSize(sizeValue);
        }
      }

      // Use the quantity from product if available, otherwise default to 1
      setQuantity(product.quantity || 1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    onAddToCart({ ...product, selectedSize, quantity });
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    onBuyNow({ ...product, selectedSize, quantity });
    onClose();
  };

  const isLoading = loadingStates[`add-${product.id}`];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price} EGP
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice} EGP
                  </span>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const sizeValue =
                        typeof size === "object" ? size.value : size;
                      const isAvailable =
                        typeof size === "object" ? size.available : true;
                      return (
                        <button
                          key={sizeValue}
                          onClick={() => setSelectedSize(sizeValue)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
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

              {/* Quantity */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </h4>
                <div className="flex items-center border border-gray-300 rounded-lg w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="flex-1 text-center border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#002b5e" }}
                  onMouseEnter={(e) =>
                    !isLoading && (e.target.style.backgroundColor = "#001a3d")
                  }
                  onMouseLeave={(e) =>
                    !isLoading && (e.target.style.backgroundColor = "#002b5e")
                  }
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Condition:</strong> {product.condition}
                </p>
                <p>
                  <strong>Authenticity:</strong>{" "}
                  <span className="text-green-600">{product.authenticity}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
