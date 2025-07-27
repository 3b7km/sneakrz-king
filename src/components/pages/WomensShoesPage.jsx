import { Suspense, lazy, useState, useEffect } from "react";
import OfferPopup from "../OfferPopup.jsx";

const ProductCard = lazy(() => import("../product/ProductCard.jsx"));

const LoadingGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

const WomensShoesPage = ({
  products = [],
  openQuickView,
  addToCart,
  loadingStates,
}) => {
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  // Show popup after a short delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="products-page py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1
            className="heading-primary text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#1E3B60" }}
          >
            Women's Shoes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explore our curated selection of women's sneakers combining style,
            comfort, and performance.
          </p>

          {/* Special Offer Banner */}
          <div
            className="bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 border-2 border-pink-200 rounded-2xl p-6 mx-auto max-w-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => setShowOfferPopup(true)}
            style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f9a8d4 100%)',
              boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.2)'
            }}
          >
            <div className="text-center">
              <div className="flex justify-center items-center mb-3">
                <span className="text-2xl">💕</span>
                <h3 className="text-xl font-bold text-gray-800 mx-3 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Special Women's Offer
                </h3>
                <span className="text-2xl">✨</span>
              </div>
              <div className="flex justify-center items-center space-x-4 mb-2">
                <span className="text-2xl font-bold text-gray-800">3000 EGP</span>
                <span className="text-lg text-gray-500 line-through">3200 EGP</span>
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Save 200 EGP
                </span>
              </div>
              <p className="text-pink-600 font-medium">
                + FREE Shipping on women's collection! 🚚
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Click here for details ⬆️
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<LoadingGrid />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
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

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-gray-400">👠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No women's shoes available
              </h3>
              <p className="text-gray-600">
                Check back soon for our latest women's sneaker collection.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WomensShoesPage;
