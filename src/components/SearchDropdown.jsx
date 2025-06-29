import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchDropdown = ({
  searchTerm,
  setSearchTerm,
  products = [],
  onClose = () => {},
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 8); // Limit to 8 results for performance

      setFilteredProducts(filtered);
      setIsOpen(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm, products]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
          handleProductClick(filteredProducts[selectedIndex]);
        } else if (filteredProducts.length > 0) {
          // Navigate to products page with search
          navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
          handleClose();
        }
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    // You could navigate to a product detail page if you have one
    // For now, navigate to products page and scroll to the product
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    onClose();
  };

  // Handle clear search
  const handleClear = () => {
    setSearchTerm("");
    setIsOpen(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search sneakers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.trim().length >= 2 && filteredProducts.length > 0) {
              setIsOpen(true);
            }
          }}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          aria-label="Search sneakers"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredProducts.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {/* Results Header */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Found {filteredProducts.length} result
              {filteredProducts.length !== 1 ? "s" : ""} for "{searchTerm}"
            </p>
          </div>

          {/* Product Results */}
          <div className="py-2">
            {filteredProducts.map((product, index) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  index === selectedIndex
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                role="option"
                aria-selected={index === selectedIndex}
              >
                {/* Product Image */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-shoe.jpg";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.brand} • {product.category}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {product.price} EGP
                    {product.originalPrice && (
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        {product.originalPrice} EGP
                      </span>
                    )}
                  </p>
                </div>

                {/* Status badges */}
                <div className="flex flex-col items-end gap-1">
                  {product.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {product.onSale && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* View All Results */}
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <button
              onClick={() => {
                navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                handleClose();
              }}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View all results for "{searchTerm}" →
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen &&
        searchTerm.trim().length >= 2 &&
        filteredProducts.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="px-4 py-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                No products found for "{searchTerm}"
              </p>
              <p className="text-xs text-gray-500">
                Try searching for different keywords or brands
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchDropdown;
