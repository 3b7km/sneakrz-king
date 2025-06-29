import { Loader2, ShoppingCart } from "lucide-react";

// Basic Loading Spinner
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

// Button Loading State
export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {isLoading ? loadingText : children}
    </button>
  );
};

// Add to Cart Loading State
export const AddToCartButton = ({
  onAddToCart,
  product,
  isLoading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <LoadingButton
      onClick={() => onAddToCart(product)}
      isLoading={isLoading}
      loadingText="Adding..."
      disabled={disabled}
      className={`w-full cart-action-btn ${className}`}
      style={{
        background: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
        color: "white",
        border: "none",
      }}
    >
      {!isLoading && <ShoppingCart className="w-4 h-4 mr-2" />}
      {isLoading ? "Adding to Cart..." : "Add to Cart"}
    </LoadingButton>
  );
};

// Cart Loading States
export const CartLoadingSpinner = ({ message = "Updating cart..." }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Page Loading Overlay
export const PageLoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="text-blue-600 mb-4" />
        <p className="text-lg font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Content Loading Placeholder
export const ContentLoading = ({
  lines = 3,
  className = "",
  showImage = false,
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showImage && <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded h-4"
            style={{
              width: index === lines - 1 ? "75%" : "100%",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Product Card Loading State
export const ProductCardLoading = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-200 h-64"></div>
      <div className="p-6">
        <div className="bg-gray-200 rounded h-4 mb-2"></div>
        <div className="bg-gray-200 rounded h-4 w-3/4 mb-4"></div>
        <div className="bg-gray-200 rounded h-8 w-1/3"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
