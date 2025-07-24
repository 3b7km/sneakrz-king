import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Shield, MessageCircle } from "lucide-react";

// Lazy load components for better performance
const HeroSection = lazy(() => import("../sections/HeroSection.jsx"));
const BrandFilter = lazy(() => import("../filters/BrandFilter.jsx"));
const ProductCard = lazy(() => import("../product/ProductCard.jsx"));

// Loading fallback component
const LoadingFallback = ({ className = "h-64" }) => (
  <div
    className={`${className} bg-gray-100 animate-pulse rounded-lg flex items-center justify-center`}
  >
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const HomePage = ({
  filteredProducts,
  brands,
  selectedBrand,
  setSelectedBrand,
  openQuickView,
  addToCart,
  onBuyNow,
  loadingStates,
}) => {
  return (
    <div className="home-page">
      {/* Hero Section with lazy loading */}
      <Suspense fallback={<LoadingFallback className="h-screen" />}>
        <HeroSection />
      </Suspense>

      {/* Featured Collection Section */}
      <section id="featured-collection" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="heading-primary text-4xl md:text-5xl font-bold mb-6"
              style={{ color: "#1E3B60" }}
            >
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium sneakers from the
              world's most prestigious brands
            </p>
          </div>

          {/* Brand Filter with lazy loading */}
          <Suspense fallback={<LoadingFallback className="h-16 mb-8" />}>
            <BrandFilter
              brands={brands}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
            />
          </Suspense>

          {/* Product Grid with lazy loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.slice(0, 6).map((product) => (
              <Suspense
                key={product.id}
                fallback={<LoadingFallback className="h-96" />}
              >
                <ProductCard
                  product={product}
                  onQuickView={openQuickView}
                  onAddToCart={addToCart}
                  loadingStates={loadingStates}
                />
              </Suspense>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <button
                className="btn-enhanced text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: "#002b5e" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#001a3d")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#002b5e")
                }
              >
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="heading-primary text-4xl md:text-5xl font-bold mb-6"
              style={{ color: "#1E3B60" }}
            >
              Why Choose SneakrzKing?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best sneaker shopping experience
              with authentic products and exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#1E3B60" }}
              >
                Authentic Products
              </h3>
              <p className="text-gray-600 leading-relaxed">
                100% authentic sneakers from verified suppliers and authorized
                retailers worldwide.
              </p>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <ShoppingCart className="w-10 h-10 text-green-600" />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#1E3B60" }}
              >
                Fast Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quick and secure delivery to your doorstep with real-time
                tracking and updates.
              </p>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <MessageCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#1E3B60" }}
              >
                24/7 Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Customer support available around the clock to assist with any
                questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
