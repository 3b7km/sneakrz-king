import { Suspense, lazy } from "react";

const ProductCard = lazy(() => import("../product/ProductCard.jsx"));

const LoadingGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

const MensShoesPage = ({
  products = [],
  openQuickView,
  addToCart,
  loadingStates,
}) => {
  return (
    <div className="products-page py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1
            className="heading-primary text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#1E3B60" }}
          >
            Men's Shoes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our premium collection of men's sneakers featuring the
            latest styles from top brands.
          </p>
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
                <span className="text-4xl text-gray-400">👟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No men's shoes available
              </h3>
              <p className="text-gray-600">
                Check back soon for our latest men's sneaker collection.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MensShoesPage;
