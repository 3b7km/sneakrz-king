import { Suspense, lazy, useState, useMemo } from "react";

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
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);

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
        sorted.sort((a, b) => b.rating - a.rating);
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
    onSale,
    inStock,
  ]);

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
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {showFilters ? "Hide Filters" : "More Filters"}
              </button>
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
                onClick={() => {
                  setSelectedBrand("All");
                  setPriceRange([0, 5000]);
                  setSortBy("newest");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
