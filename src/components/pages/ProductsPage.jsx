import { Suspense, lazy, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Lazy load components
const BrandFilter = lazy(() => import("../filters/BrandFilter.jsx"));
const ProductCard = lazy(() => import("../product/ProductCard.jsx"));
const AdvancedFilters = lazy(() => import("../filters/AdvancedFilters.jsx"));

// Loading component
const LoadingGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

const ProductsPage = ({
  filteredProducts,
  brands,
  selectedBrand,
  setSelectedBrand,
  openQuickView,
  addToCart,
  loadingStates,
}) => {
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);

  // Calculate the actual min and max prices from products
  const priceRangeFromProducts = useMemo(() => {
    if (filteredProducts.length === 0) return [0, 5000];
    const prices = filteredProducts.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [filteredProducts]);

  // Initialize price range based on actual products
  useState(() => {
    setPriceRange(priceRangeFromProducts);
  }, [priceRangeFromProducts]);

  // Memoized sorted and filtered products for performance
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    // Filter by gender
    if (selectedGender !== "All") {
      sorted = sorted.filter((product) => product.gender === selectedGender);
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      sorted = sorted.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }

    // Filter by sizes - Fix the size filtering logic
    if (selectedSizes.length > 0) {
      sorted = sorted.filter((product) =>
        product.sizes?.some((size) => {
          const sizeValue = typeof size === "object" ? size.value : size;
          return selectedSizes.includes(sizeValue);
        }),
      );
    }

    // Filter by price range
    sorted = sorted.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Filter by sale status
    if (onSale) {
      sorted = sorted.filter((product) => product.onSale);
    }

    // Filter by stock status
    if (inStock) {
      sorted = sorted.filter((product) =>
        product.sizes?.some((size) =>
          typeof size === "object" ? size.available : true,
        ),
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return sorted;
  }, [
    filteredProducts,
    sortBy,
    priceRange,
    selectedGender,
    selectedCategories,
    selectedSizes,
    onSale,
    inStock,
  ]);

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedGender("All");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange(priceRangeFromProducts);
    setOnSale(false);
    setInStock(false);
    setSortBy("newest");
    setSelectedBrand("All");
  };

  return (
    <div className="products-page py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1
            className="heading-primary text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#1E3B60" }}
          >
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our complete collection of premium sneakers from the world's
            leading brands.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Brand Filter */}
          <Suspense
            fallback={
              <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
            }
          >
            <BrandFilter
              brands={brands}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
            />
          </Suspense>

          {/* Sort and Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {sortedProducts.length} products
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                style={{ backgroundColor: "#002b5e" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#001a3d")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#002b5e")
                }
              >
                {showFilters ? "Hide Filters" : "Show More Filters"}
              </button>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Gender Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {["All", "Men", "Women"].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border ${
                    selectedGender === gender
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {gender === "All" ? "All Products" : `${gender}'s Shoes`}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Suspense
              fallback={
                <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
              }
            >
              <AdvancedFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                products={filteredProducts}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                onSale={onSale}
                setOnSale={setOnSale}
                inStock={inStock}
                setInStock={setInStock}
              />
            </Suspense>
          )}
        </div>

        {/* Products Grid */}
        <Suspense fallback={<LoadingGrid />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={openQuickView}
                onAddToCart={addToCart}
                loadingStates={loadingStates}
              />
            ))}
          </div>
        </Suspense>

        {/* No Products Found */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-gray-400">👟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms to find what you're
                looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                style={{ backgroundColor: "#002b5e" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#001a3d")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#002b5e")
                }
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Load More Button for Performance */}
        {sortedProducts.length > 12 && (
          <div className="text-center mt-12">
            <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
