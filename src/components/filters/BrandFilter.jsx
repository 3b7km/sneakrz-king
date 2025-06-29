import { memo } from "react";

// Memoized BrandFilter for performance optimization
const BrandFilter = memo(({ brands, selectedBrand, onBrandChange }) => {
  return (
    <div className="brand-filter-enhanced mb-8">
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {brands.map((brand) => (
          <button
            key={brand.name}
            onClick={() => onBrandChange(brand.name)}
            className={`brand-filter-btn px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              selectedBrand === brand.name
                ? "text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 shadow-sm"
            }`}
            style={
              selectedBrand === brand.name ? { backgroundColor: "#002b5e" } : {}
            }
            aria-pressed={selectedBrand === brand.name}
            aria-label={`Filter by ${brand.name} brand, ${brand.count} products`}
          >
            <span className="font-semibold">{brand.name}</span>
            <span className="ml-2 text-sm opacity-75 bg-white/20 px-2 py-1 rounded-full">
              {brand.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Description */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {selectedBrand === "All"
            ? `Showing all ${brands.find((b) => b.name === "All")?.count || 0} products`
            : `Showing ${brands.find((b) => b.name === selectedBrand)?.count || 0} ${selectedBrand} products`}
        </p>
      </div>
    </div>
  );
});

BrandFilter.displayName = "BrandFilter";

export default BrandFilter;
