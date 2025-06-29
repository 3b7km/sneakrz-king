import { Suspense, lazy, useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useProductFilters, useLoadingStates } from "./hooks/usePerformance.js";
import Navigation from "./components/Navigation.jsx";
import "./App.css";
//king
// Lazy load pages for optimal performance
const HomePage = lazy(() => import("./components/pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("./components/pages/ProductsPage.jsx"));
const MensShoesPage = lazy(
  () => import("./components/pages/MensShoesPage.jsx"),
);
const WomensShoesPage = lazy(
  () => import("./components/pages/WomensShoesPage.jsx"),
);
const BrandsPage = lazy(() => import("./components/pages/BrandsPage.jsx"));
const AboutPage = lazy(() => import("./components/pages/AboutPage.jsx"));
const CartPage = lazy(() => import("./components/pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./components/pages/CheckoutPage.jsx"));
const OrderConfirmation = lazy(
  () => import("./components/OrderConfirmation.jsx"),
);

// Lazy load components
const Footer = lazy(() => import("./components/Footer.jsx"));
const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat.jsx"));
const QuickViewModal = lazy(() => import("./components/QuickViewModal.jsx"));
const SuccessNotification = lazy(
  () => import("./components/SuccessNotification.jsx"),
);

// Optimized products data with performance in mind
const products = [
  {
    id: 1,
    name: "Nike Air Force 1 '07 Triple White",
    price: 1950,
    originalPrice: 2700,
    image: "/Sneakers photos/AF1.jpg",
    images: ["/Sneakers photos/AF1.jpg"],
    rating: 4.8,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Men",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 2,
    name: "Adidas Samba OG 'White Black Gum'",
    price: 1750,
    originalPrice: 2100,
    image: "/Sneakers photos/AdidasSambaOG'WhiteBlackGum'.jpg",
    images: ["/Sneakers photos/AdidasSambaOG'WhiteBlackGum'.jpg"],
    rating: 4.7,
    brand: "Adidas",
    category: "Lifestyle",
    gender: "Women",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: false,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 3,
    name: "Air Jordan 1 'Equality'",
    price: 2200,
    image: "/Sneakers photos/Jordan1LowLightSmokeGrey.jpg",
    images: ["/Sneakers photos/Jordan1LowLightSmokeGrey.jpg"],
    rating: 4.5,
    brand: "Jordan",
    category: "Basketball",
    gender: "Men",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: false,
    onSale: false,
    sizes: [
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
    ],
  },
  {
    id: 5,
    name: "Nike Air Max 97 'Black'",
    price: 1650,
    image: "/Sneakers photos/airmax97blac.jpg",
    images: ["/Sneakers photos/airmax97blac.jpg"],
    rating: 4.7,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Women",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: false,
    onSale: false,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
    ],
  },
  {
    id: 6,
    name: "New Balance 327 'Sea Salt'",
    price: 1450,
    image: "/Sneakers photos/NB53.jpg",
    images: ["/Sneakers photos/NB53.jpg"],
    rating: 4.4,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "Women",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: true,
    onSale: false,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: false },
    ],
  },
  {
    id: 7,
    name: "ASICS Gel-Lyte III 'White Grey'",
    price: 1350,
    image: "/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg",
    images: ["/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg"],
    rating: 4.3,
    brand: "ASICS",
    category: "Running",
    gender: "Men",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: false,
    onSale: false,
    sizes: [
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: false },
    ],
  },
  {
    id: 8,
    name: "Air Jordan 4 Retro 'Red Thunder'",
    price: 3250,
    originalPrice: 3650,
    image: "/Sneakers photos/redthunder.jpg",
    images: [
      "/Sneakers photos/redthunder.jpg",
      "/Sneakers photos/blackcat.jpg",
      "/Sneakers photos/jorden11.jpg",
    ],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "Men",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 9,
    name: "Nike Air Max 97 'Triple Black'",
    price: 2050,
    image: "/Sneakers photos/airmax97blac.jpg",
    images: ["/Sneakers photos/airmax97blac.jpg"],
    rating: 4.6,
    brand: "Nike",
    category: "Running",
    gender: "Women",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: true,
    onSale: false,
    sizes: [
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: false },
    ],
  },
  {
    id: 19,
    name: "Nike Dunk Low 'Panda'",
    price: 2150,
    originalPrice: 2450,
    image: "/Sneakers photos/NikeDunkLowRetro'Panda'.jpg",
    images: [
      "/Sneakers photos/NikeDunkLowRetro'Panda'.jpg",
      "/Sneakers photos/AF1.jpg",
      "/Sneakers photos/NikeAirForce1Low'07Black.jpg",
    ],
    rating: 4.8,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Women",
    condition: "Brand New",
    authenticity: "100% Guaranteed",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "37", available: true },
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
    ],
  },
];

// Performance-optimized Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading premium sneakers...</p>
    </div>
  </div>
);

// Main App Component - Optimized for Performance
function App() {
  // Performance hooks
  const { loadingStates } = useLoadingStates();
  const filters = useProductFilters(products);

  // Local state for UI
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("sneakrz-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState(null);

  // Optimized cart functions with performance improvements
  const addToCart = useCallback(
    async (product) => {
      const productKey = `add-${product.id}`;

      try {
        // Simulate API call with proper loading state
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existingItem = cartItems.find(
          (item) =>
            item.id === product.id &&
            item.selectedSize === product.selectedSize,
        );

        let updatedCart;
        if (existingItem) {
          updatedCart = cartItems.map((item) =>
            item.id === product.id && item.selectedSize === product.selectedSize
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item,
          );
        } else {
          updatedCart = [
            ...cartItems,
            {
              ...product,
              quantity: product.quantity || 1,
              selectedSize:
                product.selectedSize || product.sizes?.[0]?.value || "N/A",
            },
          ];
        }

        setCartItems(updatedCart);
        localStorage.setItem("sneakrz-cart", JSON.stringify(updatedCart));

        setSuccessNotification({
          message: `"${product.name}" has been added to your cart.`,
          onViewCart: () => {
            setSuccessNotification(null);
            window.location.href = "/cart";
          },
          onClose: () => setSuccessNotification(null),
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    },
    [cartItems],
  );

  const updateCartItem = useCallback(
    (id, selectedSize, quantity) => {
      if (quantity <= 0) {
        removeFromCart(id, selectedSize);
        return;
      }

      const updatedCart = cartItems.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item,
      );
      setCartItems(updatedCart);
      localStorage.setItem("sneakrz-cart", JSON.stringify(updatedCart));
    },
    [cartItems],
  );

  const removeFromCart = useCallback(
    (id, selectedSize) => {
      const updatedCart = cartItems.filter(
        (item) => !(item.id === id && item.selectedSize === selectedSize),
      );
      setCartItems(updatedCart);
      localStorage.setItem("sneakrz-cart", JSON.stringify(updatedCart));
    },
    [cartItems],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.setItem("sneakrz-cart", JSON.stringify([]));
  }, []);

  // Quick View functions
  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  }, []);

  const handleBuyNow = useCallback((product) => {
    const newCart = [
      {
        ...product,
        quantity: product.quantity || 1,
        selectedSize:
          product.selectedSize || product.sizes?.[0]?.value || "N/A",
      },
    ];
    setCartItems(newCart);
    localStorage.setItem("sneakrz-cart", JSON.stringify(newCart));
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 120);
  }, []);

  return (
    <Router>
      <div className="App min-h-screen overflow-x-hidden">
        <Navigation
          cartItems={cartItems}
          searchTerm={filters.searchTerm}
          setSearchTerm={filters.setSearchTerm}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          products={products}
        />

        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    filteredProducts={filters.filteredProducts}
                    brands={filters.brands}
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/products"
                element={
                  <ProductsPage
                    filteredProducts={filters.filteredProducts}
                    brands={filters.brands}
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/mens-shoes"
                element={
                  <MensShoesPage
                    products={products.filter((p) => p.gender === "Men")}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/womens-shoes"
                element={
                  <WomensShoesPage
                    products={products.filter((p) => p.gender === "Women")}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/brands"
                element={
                  <BrandsPage
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    brands={filters.brands}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/cart"
                element={
                  <CartPage
                    cartItems={cartItems}
                    updateCartItem={updateCartItem}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                  />
                }
              />
              <Route
                path="/checkout"
                element={<CheckoutPage cartItems={cartItems} />}
              />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
            </Routes>
          </Suspense>
        </main>

        <Suspense fallback={<div></div>}>
          <Footer />
          <WhatsAppFloat />

          <QuickViewModal
            product={quickViewProduct}
            isOpen={isQuickViewOpen}
            onClose={closeQuickView}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
            loadingStates={loadingStates}
          />

          {successNotification && (
            <SuccessNotification
              message={successNotification.message}
              onViewCart={successNotification.onViewCart}
              onClose={successNotification.onClose}
            />
          )}
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
