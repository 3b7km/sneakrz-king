import { useState, useMemo } from "react";
import { X } from "lucide-react";

const AdvancedFilters = ({
  priceRange,
  setPriceRange,
  products = [],
  selectedCategories = [],
  setSelectedCategories = () => {},
  selectedSizes = [],
  setSelectedSizes = () => {},
  onSale = false,
  setOnSale = () => {},
  inStock = false,
  setInStock = () => {},
}) => {
  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))];
    const sizes = [
      ...new Set(
        products.flatMap(
          (p) =>
            p.sizes?.map((s) => (typeof s === "object" ? s.value : s)) || [],
        ),
      ),
    ].sort((a, b) => parseInt(a) - parseInt(b));

    const minPrice = Math.min(...products.map((p) => p.price));
    const maxPrice = Math.max(...products.map((p) => p.price));

    return { categories, sizes, minPrice, maxPrice };
  }, [products]);

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSizeToggle = (size) => {
    try {
      const sizeStr = String(size); // Ensure size is a string for comparison
      if (selectedSizes.includes(sizeStr)) {
        setSelectedSizes(selectedSizes.filter((s) => s !== sizeStr));
      } else {
        setSelectedSizes([...selectedSizes, sizeStr]);
      }
    } catch (error) {
      console.error("Error toggling size:", error);
    }
  };

  const clearAllFilters = () => {
    try {
      setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]);
      setSelectedCategories([]);
      setSelectedSizes([]);
      setOnSale(false);
      setInStock(false);
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  const activeFiltersCount = [
    selectedCategories.length > 0,
    selectedSizes.length > 0,
    priceRange[0] > filterOptions.minPrice ||
      priceRange[1] < filterOptions.maxPrice,
    onSale,
    inStock,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Filters
          </span>
          {activeFiltersCount > 0 && (
            <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range (EGP)
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Min"
                min={filterOptions.minPrice}
                max={priceRange[1]}
              />
              <span className="text-gray-400 font-medium">to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Max"
                min={priceRange[0]}
                max={filterOptions.maxPrice}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {filterOptions.minPrice} EGP
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {filterOptions.maxPrice} EGP
              </span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categories
          </label>
          <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filterOptions.categories.map((category) => (
              <label
                key={category}
                className="flex items-center group cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                  {category}
                </span>
              </label>
            ))}
          </div>
          {filterOptions.categories.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No categories available
            </p>
          )}
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sizes
          </label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {filterOptions.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSizeToggle(size);
                }}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 min-w-[48px] h-10 flex items-center justify-center ${
                  selectedSizes.includes(size)
                    ? "border-blue-500 bg-blue-500 text-white shadow-md transform scale-105"
                    : "border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                }`}
                aria-pressed={selectedSizes.includes(size)}
                role="button"
                tabIndex={0}
              >
                {size}
              </button>
            ))}
          </div>
          {filterOptions.sizes.length === 0 && (
            <p className="text-sm text-gray-500 italic">No sizes available</p>
          )}
        </div>

        {/* Additional Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Filters
          </label>
          <div className="space-y-4">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-2 transition-all"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                On Sale
              </span>
            </label>
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2 transition-all"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                In Stock
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              Active filters:
            </span>

            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                Size {size}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSizeToggle(size);
                  }}
                  className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove size ${size} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {(priceRange[0] > filterOptions.minPrice ||
              priceRange[1] < filterOptions.maxPrice) && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {priceRange[0]} - {priceRange[1]} EGP
                <button
                  onClick={() =>
                    setPriceRange([
                      filterOptions.minPrice,
                      filterOptions.maxPrice,
                    ])
                  }
                  className="hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onSale && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                On Sale
                <button
                  onClick={() => setOnSale(false)}
                  className="hover:bg-red-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStock && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                In Stock
                <button
                  onClick={() => setInStock(false)}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
