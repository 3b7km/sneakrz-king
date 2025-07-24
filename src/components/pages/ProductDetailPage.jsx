import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Plus, Minus, ShoppingCart, ArrowLeft, Share2 } from "lucide-react";
import ProductGallery from "../product/ProductGallery.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { findProductBySlug } from "../../utils/urlUtils.js";

const ProductDetailPage = ({ products, onAddToCart, onBuyNow, loadingStates = {} }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart: cartAddToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Find the product by slug and scroll to top
  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const foundProduct = findProductBySlug(products, slug);
    if (foundProduct) {
      setProduct(foundProduct);
      // Update document title
      document.title = `${foundProduct.name} - Sneakrz King`;

      // Set default size if available
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        const firstSize = foundProduct.sizes[0];
        setSelectedSize(typeof firstSize === "object" ? firstSize.value : firstSize);
      }
    }
    setIsLoading(false);

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'Sneakrz King';
    };
  }, [slug, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    try {
      const productToAdd = {
        ...product,
        selectedSize,
        quantity,
      };

      // Try using the prop first, fallback to CartContext
      if (onAddToCart) {
        await onAddToCart(productToAdd);
      } else {
        // Fallback to CartContext
        cartAddToCart(product, quantity, selectedSize);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    try {
      const productToAdd = {
        ...product,
        selectedSize,
        quantity,
      };

      // Try using the prop first, fallback to CartContext
      if (onAddToCart) {
        await onAddToCart(productToAdd);
      } else {
        // Fallback to CartContext
        cartAddToCart(product, quantity, selectedSize);
      }

      // Navigate to checkout after successful addition
      navigate("/checkout");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing ${product.name} for ${product.price} EGP!`,
          url: window.location.href,
        });
      } catch (error) {
        // Only fallback to copy if the error isn't from user cancellation
        if (error.name !== 'AbortError') {
          console.log("Sharing failed:", error);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    } catch (error) {
      console.log("Copy to clipboard failed:", error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Product link copied to clipboard!");
      } catch (fallbackError) {
        alert("Could not copy link. Please copy manually: " + window.location.href);
      }
      document.body.removeChild(textArea);
    }
  };

  const isAddToCartLoading = loadingStates[`add-${product.id}`];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductGallery
              images={product.images || [product.image]}
              productName={product.name}
              className="h-96 sm:h-[500px] lg:h-[600px]"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Status Badge */}
            {product.isNew && (
              <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                New Arrival
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
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
              </div>
              <span className="text-lg text-gray-600 font-medium">
                ({product.rating})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                {product.price} EGP
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    {product.originalPrice} EGP
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-semibold">
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

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
              <div>
                <span className="text-sm font-medium text-gray-500">Brand</span>
                <p className="text-lg font-semibold text-gray-900">{product.brand}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-lg font-semibold text-gray-900">{product.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Gender</span>
                <p className="text-lg font-semibold text-gray-900 capitalize">{product.gender}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Condition</span>
                <p className="text-lg font-semibold text-gray-900">{product.condition}</p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size, index) => {
                    const sizeValue = typeof size === "object" ? size.value : size;
                    const isAvailable = typeof size === "object" ? size.available : true;
                    return (
                      <button
                        key={`${product.id}-size-${sizeValue}-${index}`}
                        onClick={() => setSelectedSize(sizeValue)}
                        disabled={!isAvailable}
                        className={`h-12 border rounded-lg text-sm font-medium transition-all ${
                          selectedSize === sizeValue
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                            : isAvailable
                              ? "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
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
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center border rounded-lg py-2 font-medium"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddToCartLoading}
                  className="w-full py-4 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#002b5e" }}
                >
                  {isAddToCartLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isAddToCartLoading}
                  className="w-full py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Product Description */}
            <div className="p-6 bg-white rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience the perfect blend of style and comfort with the {product.name}. 
                This {product.brand} masterpiece features premium materials and exceptional 
                craftsmanship that delivers both performance and street-ready style. 
                Whether you're hitting the court or the streets, these shoes provide 
                the comfort and confidence you need to make your mark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
