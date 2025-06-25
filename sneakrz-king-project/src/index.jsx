import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  Star,
  Shield,
  MessageCircle,
  Eye,
  Instagram,
  Phone,
  Plus,
  Minus,
} from "lucide-react";
import "./App.css";
import airForce1 from "./assets/products/nike-air-force-1.jpg";
import jordan4MilitaryBlack from "./assets/products/jordan-4-military-black.jpg";
import adidasSamba from "./assets/products/adidas-samba-white-gum.jpg";
import airmax97 from "./assets/products/airmax97.jpg";
import jordan4BlackCat from "./assets/products/jordan-4-black-cat.jpg";
import adidasSambaWhiteGum1 from "./assets/products/adidas-samba-white-gum1.jpg";
import jordan1Equality from "./assets/products/jordan1-equality.jpg";
import airMax97Black from "./assets/products/air-max-97-black.jpg";

// Enhanced UI Components
const Card = ({ children, className = "", ...props }) => (
  <div className={`card-professional ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-300 focus-professional disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "btn-professional",
    outline: "btn-secondary",
    ghost: "hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2",
    buyNow:
      "bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-6 py-3",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input className={`form-input ${className}`} {...props} />
);

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    new: "badge-new status-badge",
  };

  return (
    <span
      className={`status-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Success Notification Component
const SuccessNotification = ({ message, onViewCart, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-fadeInUp">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-green-500 text-sm">✓</span>
            </div>
            <span className="font-medium">{message}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewCart}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              View Cart
            </Button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// WhatsApp Floating Button Component
const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/201023329072"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
};

// Enhanced Brands Page Component
const BrandsPage = ({ selectedBrand, setSelectedBrand }) => {
  const navigate = useNavigate();
  const brandsData = [
    {
      name: "Nike",
      description: "Just Do It - The world's leading athletic brand",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      products: 25,
    },
    {
      name: "Adidas",
      description: "Impossible is Nothing - German sportswear giant",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
      products: 18,
    },
    {
      name: "Jordan",
      description: "Jumpman - Basketball heritage and style",
      image:
        "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400",
      products: 15,
    },
    {
      name: "New Balance",
      description: "Endorsed by No One - Premium comfort and performance",
      image:
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400",
      products: 12,
    },
  ];

  const handleViewCollection = (brandName) => {
    setSelectedBrand(brandName);
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Page Header */}
      <section className="bg-white border-b border-gray-200 section-padding py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="heading-primary text-responsive-xl gradient-text mb-4">
              Our Brands
            </h1>
            <p className="text-body text-responsive-md max-w-2xl mx-auto">
              Discover the world's most prestigious sneaker brands, each with
              their unique heritage and style.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandsData.map((brand, index) => (
              <div
                key={brand.name}
                className="brand-card animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3
                  className="heading-secondary text-xl font-semibold mb-2"
                  style={{ color: "#2C3E50" }}
                >
                  {brand.name}
                </h3>
                <p className="text-body mb-4">{brand.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800">
                    {brand.products} Products
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover-lift"
                    onClick={() => handleViewCollection(brand.name)}
                  >
                    View Collection
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Enhanced About Page Component
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Page Header */}
      <section className="bg-white border-b border-gray-200 section-padding py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="heading-primary text-responsive-xl gradient-text mb-4">
              About SneakrzKing
            </h1>
            <p className="text-body text-responsive-md max-w-2xl mx-auto">
              Your premier destination for authentic sneakers from the world's
              leading brands.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="heading-secondary text-2xl gradient-text mb-6">
                Our Story
              </h2>
              <p className="text-body mb-6">
                SneakrzKing was founded with a simple mission: to provide
                sneaker enthusiasts in Egypt with access to the world's most
                coveted footwear. We understand that sneakers are more than just
                shoes – they're a form of self-expression, a statement of style,
                and a reflection of personality.
              </p>
              <p className="text-body mb-6">
                Since our inception, we've built strong relationships with
                authorized retailers and verified suppliers worldwide to ensure
                that every pair of sneakers we sell is 100% authentic. Our team
                of sneaker experts carefully curates our collection to bring you
                the latest releases, classic favorites, and hard-to-find gems.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="heading-secondary text-2xl gradient-text mb-6">
                Our Commitment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="heading-secondary text-lg font-semibold mb-3">
                    Authenticity Guaranteed
                  </h3>
                  <p className="text-body">
                    Every sneaker in our collection is verified for authenticity
                    through our rigorous quality control process.
                  </p>
                </div>
                <div>
                  <h3 className="heading-secondary text-lg font-semibold mb-3">
                    Fast & Secure Delivery
                  </h3>
                  <p className="text-body">
                    We ensure your sneakers reach you quickly and safely with
                    our reliable delivery partners.
                  </p>
                </div>
                <div>
                  <h3 className="heading-secondary text-lg font-semibold mb-3">
                    Customer Satisfaction
                  </h3>
                  <p className="text-body">
                    Our dedicated support team is always ready to assist you
                    with any questions or concerns.
                  </p>
                </div>
                <div>
                  <h3 className="heading-secondary text-lg font-semibold mb-3">
                    Competitive Pricing
                  </h3>
                  <p className="text-body">
                    We offer competitive prices without compromising on quality
                    or authenticity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="heading-secondary text-2xl gradient-text mb-6">
                Contact Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="heading-secondary text-lg font-semibold mb-3">
                    Get in Touch
                  </h3>
                  <p className="text-body mb-4">
                    Have questions about our products or need assistance with
                    your order? We're here to help!
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://wa.me/201023329072"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp: +20 102 332 9072
                    </a>
                    <a
                      href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      @sneakrz.king
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="heading-secondary text-lg font-semibold mb-3">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-body">
                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: 12:00 PM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Quantity Selector Component
const QuantitySelector = ({ quantity, onQuantityChange, className = "" }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1) {
      onQuantityChange(value);
    }
  };

  return (
    <div
      className={`flex items-center border border-gray-300 rounded-lg ${className}`}
    >
      <button
        onClick={handleDecrease}
        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="w-16 text-center border-0 focus:outline-none"
        min="1"
      />
      <button
        onClick={handleIncrease}
        className="p-2 hover:bg-gray-100 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

// Size Selector Component
const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {sizes.map((size) => (
        <button
          key={size.value}
          onClick={() => onSizeChange(size.value)}
          disabled={!size.available}
          className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
            selectedSize === size.value
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : size.available
                ? "border-gray-300 hover:border-gray-400 text-gray-700"
                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
          }`}
        >
          {size.value}
        </button>
      ))}
    </div>
  );
};

// Enhanced Navigation Component
const Navigation = ({
  cartItems,
  searchTerm,
  setSearchTerm,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => setIsMenuOpen(false);

  return (
    <nav
      className="nav-professional sticky top-0 z-50 shadow-lg"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl pl-4 sm:pl-6 lg:pl-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center group"
              tabIndex={0}
              aria-label="Home"
            >
              <div className="w-12 h-12 mr-4 transition-transform duration-300 group-hover:scale-110">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fcb0376fc8e71411c9ebb0a3533b4d888%2F9d94d31e894f47c7ab1bcdd0297a87c3"
                  alt="SneakrzKing Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive("/") ? "active" : "text-gray-600 hover:text-blue-600"}`}
                style={isActive("/") ? { color: "#2C3E50" } : {}}
                tabIndex={0}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive("/products") ? "active" : "text-gray-600 hover:text-blue-600"}`}
                style={isActive("/products") ? { color: "#2C3E50" } : {}}
                tabIndex={0}
              >
                Products
              </Link>
              <Link
                to="/brands"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive("/brands") ? "active" : "text-gray-600 hover:text-blue-600"}`}
                style={isActive("/brands") ? { color: "#2C3E50" } : {}}
                tabIndex={0}
              >
                Brands
              </Link>
              <Link
                to="/about"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive("/about") ? "active" : "text-gray-600 hover:text-blue-600"}`}
                style={isActive("/about") ? { color: "#2C3E50" } : {}}
                tabIndex={0}
              >
                About
              </Link>
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-gray-600 hover:text-pink-600 px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-1"
                tabIndex={0}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="search-container">
              <Search className="search-icon w-5 h-5" />
              <Input
                type="text"
                placeholder="Search premium sneakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-64"
                aria-label="Search sneakers"
              />
            </div>

            {/* Enhanced Cart and Wishlist Icons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 hover-lift"
                aria-label="View cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
          aria-hidden={!isMenuOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <Link
              to="/"
              onClick={handleMobileLinkClick}
              className="nav-link block px-3 py-4 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={handleMobileLinkClick}
              className="nav-link block px-3 py-4 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              Products
            </Link>
            <Link
              to="/brands"
              onClick={handleMobileLinkClick}
              className="nav-link block px-3 py-4 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              Brands
            </Link>
            <Link
              to="/about"
              onClick={handleMobileLinkClick}
              className="nav-link block px-3 py-4 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              About
            </Link>
            <a
              href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleMobileLinkClick}
              className="nav-link block px-3 py-4 text-lg font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center gap-2"
              tabIndex={isMenuOpen ? 0 : -1}
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="search-container">
                <Search className="search-icon w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search sneakers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Search sneakers"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Product Card Component
const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  return (
    <div className="product-card-enhanced group">
      <div className="product-image-container relative">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-64 object-cover"
        />

        {/* Enhanced Status Badges */}
        {product.isNew && (
          <Badge variant="new" className="status-badge absolute top-3 left-3">
            New
          </Badge>
        )}

        {/* Enhanced Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onQuickView(product)}
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4 mr-1" />
              Quick View
            </Button>
          </div>
        </div>

        <Button
          onClick={() => onAddToCart(product)}
          className="w-full btn-enhanced"
          style={{
            background: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
            color: "white",
            border: "none",
          }}
          size="md"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      <CardContent className="p-6">
        {/* Enhanced Rating Display */}
        <div className="rating-stars mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`star w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "empty"}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>

        <h3
          className="heading-secondary text-lg font-semibold mb-2 line-clamp-2"
          style={{ color: "#2C3E50" }}
        >
          {product.name}
        </h3>

        {/* Enhanced Price Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="price-current">{product.price} EGP</span>
            {product.originalPrice && (
              <>
                <span className="price-original">
                  {product.originalPrice} EGP
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

// Enhanced Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToProducts = () => {
    const productsSection = document.getElementById("featured-collection");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="hero-section-enhanced relative overflow-hidden min-h-[500px] flex items-center justify-center"
      style={{ minHeight: "80vh" }}
    >
      {/* 3D Logo Video as Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ objectFit: "cover" }}
      >
        <source src="/logo3d.mp4" type="video/mp4" />
        <p>video</p>
        <p>
          <br />
        </p>
      </video>
      {/* Centered Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4">
        <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-6 text-center animate-fadeInUp">
          Step Into <span style={{ color: "#2C3E50" }}>Greatness</span>
        </h1>
        <p className="hero-subtitle text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto text-center animate-fadeInUp animation-delay-200">
          Discover the latest and greatest sneakers from top brands. Authentic
          products, fast delivery, and unmatched style.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-400">
          <Button
            onClick={scrollToProducts}
            size="lg"
            className="text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            style={{ backgroundColor: "rgba(0, 43, 94, 1)" }}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Shop Now
          </Button>
          <Button
            onClick={() => navigate("/products")}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
          >
            View Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

// Enhanced Brand Filter Component
const BrandFilter = ({ brands, selectedBrand, onBrandChange }) => {
  return (
    <div className="brand-filter-enhanced mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {brands.map((brand) => (
          <button
            key={brand.name}
            onClick={() => onBrandChange(brand.name)}
            className={`brand-filter-btn px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedBrand === brand.name
                ? "text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
            }`}
            style={
              selectedBrand === brand.name ? { backgroundColor: "#002b5e" } : {}
            }
          >
            {brand.name}
            <span className="ml-2 text-sm opacity-75">{brand.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Quick View Modal Component
const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product) {
      // Set default size to first available size
      const firstAvailableSize = product.sizes?.find((size) => size.available);
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.value);
      }
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    onAddToCart({ ...product, selectedSize, quantity });
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    onBuyNow({ ...product, selectedSize, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              {product.isNew && (
                <Badge variant="new" className="absolute top-4 left-4">
                  New
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "empty"}`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.rating})</span>
              </div>

              {/* Product Name */}
              <h2 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price} EGP
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice} EGP
                  </span>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <SizeSelector
                  sizes={product.sizes || []}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>

              {/* Product Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p>
                    <span className="font-medium">Condition:</span>{" "}
                    {product.condition}
                  </p>
                  <p>
                    <span className="font-medium">Authenticity:</span>{" "}
                    {product.authenticity}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
                    border: "none",
                  }}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="buyNow"
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Cart Page Component
const CartPage = ({ cartItems, updateCartItem, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 29); // 4:29 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 80;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => navigate("/products")} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-2 font-medium text-gray-900">
                SHOPPING CART
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 font-medium text-gray-600">CHECKOUT</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 font-medium text-gray-600">
                ORDER STATUS
              </span>
            </div>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-orange-800">
            🔥{" "}
            <strong>
              Hurry up, these products are limited, checkout within{" "}
              {formatTime(timeLeft)}
            </strong>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <div className="col-span-2">PRODUCT</div>
                  <div>PRICE</div>
                  <div>SKU</div>
                  <div>QUANTITY</div>
                  <div>SUBTOTAL</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.selectedSize || "no-size"}-${index}`}
                    className="px-6 py-6"
                  >
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div className="col-span-2 flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Size: {item.selectedSize}
                          </p>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.selectedSize)
                            }
                            className="text-sm text-red-600 hover:text-red-800 mt-1"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-900 font-medium">
                        {item.price} EGP
                      </div>
                      <div className="text-gray-600 text-sm">110036446</div>
                      <div>
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) =>
                            updateCartItem(
                              item.id,
                              item.selectedSize,
                              newQuantity,
                            )
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="text-gray-900 font-medium">
                        {item.price * item.quantity} EGP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <div className="flex space-x-4">
                <Input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">OK</Button>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  🗑️ CLEAR SHOPPING CART
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">CART TOTALS</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} EGP</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>Flat rate: {shipping} EGP</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Shipping options will be updated during checkout.
                  </p>
                  <button className="text-sm text-blue-600 hover:underline mt-1">
                    Calculate shipping
                  </button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>TOTAL</span>
                    <span>{total} EGP</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  size="lg"
                >
                  PROCEED TO CHECKOUT
                </Button>
                <Button
                  onClick={() => navigate("/products")}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  CONTINUE SHOPPING
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Checkout Page Component
const CheckoutPage = ({ cartItems }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "Egypt",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    shipToDifferent: false,
    orderNotes: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 80;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use the React state data directly
    const customerData = {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.streetAddress || "",
      city: formData.city || "",
      state: formData.state || "",
      notes: formData.orderNotes || "",
    };

    // Validate required fields
    if (
      !customerData.firstName ||
      !customerData.phone ||
      !customerData.address
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Initialize EmailJS
    emailjs.init("xZ-FMAkzHPph3aojg");

    // Prepare email template parameters
    const emailParams = {
      to_email: "your-email@gmail.com", // Replace with your actual email
      from_name: `${customerData.firstName} ${customerData.lastName}`,
      customer_name: `${customerData.firstName} ${customerData.lastName}`,
      customer_phone: customerData.phone,
      customer_email: customerData.email,
      customer_address: customerData.address,
      customer_city: customerData.city,
      customer_state: customerData.state,
      order_notes: customerData.notes,
      order_total: total.toFixed(2),
      order_items: cartItems
        .map(
          (item) =>
            `${item.name} (${item.brand}) - المقاس: ${item.selectedSize || "غير محدد"} - الكمية: ${item.quantity} - السعر: ${item.price} جنيه`,
        )
        .join("\n"),
      order_date: new Date().toLocaleDateString("ar-EG"),
      order_time: new Date().toLocaleTimeString("ar-EG"),
    };

    // Send email using EmailJS
    emailjs
      .send("default_service", "template_1", emailParams)
      .then(() => {
        alert("تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.");
        // Clear cart after successful order
        setCartItems([]);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Coupon Banner */}
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-8 text-center">
          <p>
            🏷️ Have a coupon?{" "}
            <button className="text-blue-300 hover:underline">
              Click here to enter your code
            </button>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Billing Details */}
          <div>
            <h2 className="text-2xl font-bold mb-6">BILLING DETAILS</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First name *
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last name *
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country / Region *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Egypt">Egypt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street address *
                </label>
                <Input
                  type="text"
                  name="streetAddress"
                  placeholder="House number and street name"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Town / City *
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / County *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option...</option>
                  <option value="cairo">Cairo</option>
                  <option value="alexandria">Alexandria</option>
                  <option value="giza">Giza</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="shipToDifferent"
                  checked={formData.shipToDifferent}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  Ship to a different address?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order notes (optional)
                </label>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-6">YOUR ORDER</h3>

              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize || "no-size"}-${index}`}
                  className="flex justify-between items-center py-3 border-b border-gray-200"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {item.price} EGP
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {item.selectedSize}
                    </p>
                  </div>
                  <span className="font-medium">
                    {item.price * item.quantity} EGP
                  </span>
                </div>
              ))}

              <div className="space-y-3 mt-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} EGP</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Flat rate: {shipping} EGP</span>
                </div>

                <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                  <span>TOTAL</span>
                  <span>{total} EGP</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    name="payment"
                    id="cod"
                    defaultChecked
                    className="mr-2"
                  />
                  <label htmlFor="cod" className="font-medium">
                    Cash on delivery
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Pay with cash upon delivery.
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </p>

              <Button
                onClick={handleSubmit}
                className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white"
                size="lg"
              >
                PLACE ORDER
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Footer Component
const Footer = () => {
  return (
    <footer className="footer-enhanced" style={{ backgroundColor: "#2C3E50" }}>
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-16"
        style={{ backgroundColor: "#1e3b60", maxWidth: "1410px" }}
      >
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 mr-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fcb0376fc8e71411c9ebb0a3533b4d888%2Ff322eb655db24ea58df7325cb5eb92ff"
                  alt="Sneakrz King White Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-gray-200 mb-6 leading-relaxed">
              Your premier destination for authentic sneakers from the world's
              leading brands. Quality, authenticity, and style guaranteed.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link p-3 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/201023329072"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link p-3 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-200">
            © 2025 SneakrzKing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  // State Management with localStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("sneakrz-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState(null);

  // Sample Data
  const brands = [
    { name: "All", count: 8 },
    { name: "Jordan", count: 1 },
    { name: "Nike", count: 2 },
    { name: "Yeezy", count: 0 },
    { name: "New Balance", count: 1 },
    { name: "Adidas", count: 1 },
    { name: "Dior", count: 1 },
    { name: "ASICS", count: 1 },
  ];

  const products = [
    {
      id: 1,
      name: "Nike Air Force 1 '07 Triple White",
      price: 2900,
      originalPrice: 3200,
      image: airForce1,
      rating: 4.8,
      brand: "Nike",
      category: "Lifestyle",
      condition: "Brand New",
      authenticity: "100% Guaranteed",
      isNew: true,
      onSale: true,
      sizes: [
        { value: "36", available: false },
        { value: "37", available: true },
        { value: "38", available: true },
        { value: "39", available: true },
        { value: "40", available: true },
        { value: "41", available: true },
        { value: "42", available: false },
      ],
    },
    {
      id: 2,
      name: "Air Jordan 4 Retro 'Military Black'",
      price: 3200,
      image: jordan4MilitaryBlack,
      rating: 4.9,
      brand: "Jordan",
      category: "Basketball",
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
        { value: "44", available: false },
      ],
    },
    {
      id: 3,
      name: "Adidas Samba OG 'White Black Gum'",
      price: 1750,
      originalPrice: 2100,
      image: adidasSamba,
      rating: 4.7,
      brand: "Adidas",
      category: "Lifestyle",
      condition: "Brand New",
      authenticity: "100% Guaranteed",
      isNew: false,
      onSale: true,
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
      id: 4,
      name: "Nike Air Max 97",
      price: 1850,
      image: airmax97,
      rating: 4.9,
      brand: "Nike",
      category: "Lifestyle",
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
      ],
    },
    {
      id: 5,
      name: "Air Jordan 4 Retro 'Black Cat'",
      price: 1950,
      image: jordan4BlackCat,
      rating: 4.8,
      brand: "Jordan",
      category: "Basketball",
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
        { value: "44", available: false },
      ],
    },
    {
      id: 6,
      name: "Adidas Samba 'White Gum'",
      price: 1950,
      image: adidasSambaWhiteGum1,
      rating: 4.6,
      brand: "Adidas",
      category: "Lifestyle",
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
        { value: "44", available: false },
      ],
    },
    {
      id: 7,
      name: "Air Jordan 1 'Equality'",
      price: 2200,
      image: jordan1Equality,
      rating: 4.5,
      brand: "Jordan",
      category: "Basketball",
      condition: "Brand New",
      authenticity: "100% Guaranteed",
      isNew: false,
      onSale: false,
      sizes: [
        { value: "39", available: true },
        { value: "40", available: true },
        { value: "41", available: true },
        { value: "42", available: true },
        { value: "43", available: false },
      ],
    },
    {
      id: 8,
      name: "Nike Air Max 97 'Black'",
      price: 1650,
      image: airMax97Black,
      rating: 4.7,
      brand: "Nike",
      category: "Lifestyle",
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
  ];

  // Filter products based on search and brand
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand =
      selectedBrand === "All" || product.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Cart Functions
  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id && item.selectedSize === product.selectedSize,
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
  };

  const updateCartItem = (id, selectedSize, quantity) => {
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
  };

  const removeFromCart = (id, selectedSize) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.selectedSize === selectedSize),
    );
    setCartItems(updatedCart);
    localStorage.setItem("sneakrz-cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("sneakrz-cart", JSON.stringify([]));
  };

  // Quick View Functions
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Buy Now Function
  const handleBuyNow = (product) => {
    // Clear cart and add only this product
    setCartItems([
      {
        ...product,
        quantity: product.quantity || 1,
        selectedSize:
          product.selectedSize || product.sizes?.[0]?.value || "N/A",
      },
    ]);
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  // Home Page Component
  const HomePage = () => (
    <div className="home-page">
      <HeroSection />

      {/* Featured Collection Section */}
      <section id="featured-collection" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-primary text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium sneakers from the
              world's most coveted brands.
            </p>
          </div>

          <BrandFilter
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={openQuickView}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="btn-enhanced">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-primary text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose SneakrzKing?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best sneaker shopping experience
              with authentic products and exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Authentic Products
              </h3>
              <p className="text-gray-600 leading-relaxed">
                100% authentic sneakers from verified suppliers and authorized
                retailers worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fast Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quick and secure delivery to your doorstep with real-time
                tracking and updates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
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

  // Products Page Component
  const ProductsPage = () => (
    <div className="products-page py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="heading-primary text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our complete collection of premium sneakers from the world's
            leading brands.
          </p>
        </div>

        <BrandFilter
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={openQuickView}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Navigation
          cartItems={cartItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/brands"
              element={
                <BrandsPage
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
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
          </Routes>
        </main>

        <Footer />

        {/* WhatsApp Floating Button */}
        <WhatsAppFloat />

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={closeQuickView}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />

        {/* Success Notification */}
        {successNotification && (
          <SuccessNotification
            message={successNotification.message}
            onViewCart={successNotification.onViewCart}
            onClose={successNotification.onClose}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
