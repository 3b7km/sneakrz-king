import React, { Suspense, lazy, useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "./App.css";
import "./mobile-responsive.css";
import "./mobile-cart-fix.css";
import "./mobile-fixes.css";
import { initMobileEnhancements } from "./utils/mobileCartUtils.js";

// Hooks
import { useProductFilters } from "./hooks/useProductFilters.js";
import { useLoadingStates } from "./hooks/useLoadingStates.js";

// Components - Using lazy loading for better performance
const Navigation = lazy(() => import("./components/Navigation.jsx"));
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
const Footer = lazy(() => import("./components/Footer.jsx"));
const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat.jsx"));
const QuickViewModal = lazy(() => import("./components/QuickViewModal.jsx"));
const SuccessNotification = lazy(
  () => import("./components/SuccessNotification.jsx"),
);

// Optimized products data with performance in mind - All prices are on sale!
const products = [
  {
    id: 1,
    name: "Nike Air Force 1 '07 Triple White",
    price: 1500,
    originalPrice: 1950,
    image: "/Sneakers photos/AF1.jpg",
    images: ["/Sneakers photos/AF1.jpg"],
    rating: 4.8,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Unisex",
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
    name: "New Balance 2002R 'Protection Pack'",
    price: 1900,
    originalPrice: 2300,
    image: "/Sneakers photos/NB53.jpg",
    images: ["/Sneakers photos/NB53.jpg"],
    rating: 4.7,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "Unisex",
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
    id: 3,
    name: "New Balance 9060 'Dark Moss'",
    price: 2100,
    originalPrice: 2500,
    image: "/Sneakers photos/NB53.jpg",
    images: ["/Sneakers photos/NB53.jpg"],
    rating: 4.6,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "Unisex",
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
    id: 4,
    name: "Adidas Forum Low 'Cloud White'",
    price: 1800,
    originalPrice: 2200,
    image: "/Sneakers photos/AdidasSambaOG'WhiteBlackGum'.jpg",
    images: ["/Sneakers photos/AdidasSambaOG'WhiteBlackGum'.jpg"],
    rating: 4.5,
    brand: "Adidas",
    category: "Lifestyle",
    gender: "Unisex",
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
    id: 5,
    name: "New Balance 530 'Concrete Grey'",
    price: 1700,
    originalPrice: 2000,
    image: "/Sneakers photos/NB53.jpg",
    images: ["/Sneakers photos/NB53.jpg"],
    rating: 4.4,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "Unisex",
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
    ],
  },
  {
    id: 6,
    name: "ASICS Gel-Kayano 14 'Silver Cream'",
    price: 1900,
    originalPrice: 2300,
    image: "/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg",
    images: ["/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg"],
    rating: 4.3,
    brand: "ASICS",
    category: "Running",
    gender: "Unisex",
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
    ],
  },
  {
    id: 7,
    name: "ASICS Gel-Kahana 8 'Black Rose Gold'",
    price: 1700,
    originalPrice: 2000,
    image: "/Sneakers photos/AsicsGel-Kahana8BlackRoseGold.jpg",
    images: ["/Sneakers photos/AsicsGel-Kahana8BlackRoseGold.jpg"],
    rating: 4.2,
    brand: "ASICS",
    category: "Trail Running",
    gender: "Unisex",
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
    ],
  },
  {
    id: 8,
    name: "Air Jordan 11 Retro 'Space Jam'",
    price: 1900,
    originalPrice: 3800,
    image: "/Sneakers photos/jorden11.jpg",
    images: ["/Sneakers photos/jorden11.jpg"],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "Unisex",
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
    name: "Dior B22 'Black White'",
    price: 2300,
    originalPrice: 2800,
    image: "/Sneakers photos/AF1.jpg",
    images: ["/Sneakers photos/AF1.jpg"],
    rating: 4.8,
    brand: "Dior",
    category: "Luxury",
    gender: "Unisex",
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
    id: 10,
    name: "Air Jordan 4 Retro 'Black Cat'",
    price: 1900,
    originalPrice: 3500,
    image: "/Sneakers photos/blackcat.jpg",
    images: ["/Sneakers photos/blackcat.jpg"],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "Unisex",
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
    id: 11,
    name: "Nike Air Max 97 'Black'",
    price: 1650,
    originalPrice: 2000,
    image: "/Sneakers photos/airmax97blac.jpg",
    images: ["/Sneakers photos/airmax97blac.jpg"],
    rating: 4.7,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Unisex",
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
    ],
  },
  {
    id: 12,
    name: "Nike SB Dunk Low 'Panda'",
    price: 1600,
    originalPrice: 2150,
    image: "/Sneakers photos/NikeDunkLowRetro'Panda'.jpg",
    images: ["/Sneakers photos/NikeDunkLowRetro'Panda'.jpg"],
    rating: 4.8,
    brand: "Nike",
    category: "Skateboarding",
    gender: "Unisex",
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
  {
    id: 13,
    name: "Nike Air Force 1 Low '07 Black",
    price: 1500,
    originalPrice: 1850,
    image: "/Sneakers photos/NikeAirForce1Low'07Black.jpg",
    images: ["/Sneakers photos/NikeAirForce1Low'07Black.jpg"],
    rating: 4.6,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Unisex",
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
    id: 14,
    name: "Air Jordan 4 Retro 'Red Thunder'",
    price: 1900,
    originalPrice: 3250,
    image: "/Sneakers photos/redthunder.jpg",
    images: ["/Sneakers photos/redthunder.jpg"],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "Unisex",
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
    id: 15,
    name: "Nike Air Force 1 '07 'Triple White' V2",
    price: 1500,
    originalPrice: 1900,
    image: "/Sneakers photos/AF1.jpg",
    images: ["/Sneakers photos/AF1.jpg"],
    rating: 4.7,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Unisex",
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
    ],
  },
  {
    id: 16,
    name: "Nike Air Max 97 'Black Edition'",
    price: 1650,
    originalPrice: 1750,
    image: "/Sneakers photos/airmax97blac.jpg",
    images: ["/Sneakers photos/airmax97blac.jpg"],
    rating: 4.6,
    brand: "Nike",
    category: "Running",
    gender: "Unisex",
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
    id: 17,
    name: "New Balance 327 'Premium Pack'",
    price: 1700,
    originalPrice: 1800,
    image: "/Sneakers photos/NB53.jpg",
    images: ["/Sneakers photos/NB53.jpg"],
    rating: 4.5,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "Unisex",
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
    ],
  },
  {
    id: 18,
    name: "ASICS Gel-Kayano 14 'Platinum Edition'",
    price: 1900,
    originalPrice: 2200,
    image: "/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg",
    images: ["/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg"],
    rating: 4.4,
    brand: "ASICS",
    category: "Running",
    gender: "Unisex",
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
    ],
  },
  {
    id: 19,
    name: "ASICS Gel-Kahana 8 'Trail Edition'",
    price: 1700,
    originalPrice: 1900,
    image: "/Sneakers photos/asicsgelkahanam8.jpg",
    images: ["/Sneakers photos/asicsgelkahanam8.jpg"],
    rating: 4.3,
    brand: "ASICS",
    category: "Trail Running",
    gender: "Unisex",
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
    ],
  },
  {
    id: 20,
    name: "Nike Air Force 1 Low '07 'All Black'",
    price: 1500,
    originalPrice: 1950,
    image: "/Sneakers photos/NikeAirForce1Low'07Black.jpg",
    images: ["/Sneakers photos/NikeAirForce1Low'07Black.jpg"],
    rating: 4.8,
    brand: "Nike",
    category: "Lifestyle",
    gender: "Unisex",
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
  // Initialize mobile enhancements
  useEffect(() => {
    initMobileEnhancements();
  }, []);

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
      const loadingKey = `add-${product.id}`;

      try {
        // Start loading state
        loadingStates.setLoading(loadingKey, true);

        // Find existing item
        const existingItemIndex = cartItems.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedSize === product.selectedSize,
        );

        let newCartItems;
        if (existingItemIndex >= 0) {
          // Update existing item
          newCartItems = [...cartItems];
          newCartItems[existingItemIndex].quantity += product.quantity || 1;
        } else {
          // Add new item
          newCartItems = [
            ...cartItems,
            {
              ...product,
              quantity: product.quantity || 1,
              selectedSize:
                product.selectedSize || product.sizes?.[0]?.value || "N/A",
            },
          ];
        }

        setCartItems(newCartItems);
        localStorage.setItem("sneakrz-cart", JSON.stringify(newCartItems));

        // Success notification
        setSuccessNotification({
          message: `${product.name} added to cart!`,
          onViewCart: () => {
            window.location.href = "/cart";
          },
          onClose: () => setSuccessNotification(null),
        });

        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setSuccessNotification(null);
        }, 3000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        loadingStates.setLoading(loadingKey, false);
      }
    },
    [cartItems, loadingStates],
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
                    searchTerm={filters.searchTerm}
                    setSearchTerm={filters.setSearchTerm}
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
                    products={products}
                    brands={filters.brands}
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
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
