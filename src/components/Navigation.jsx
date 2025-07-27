import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Instagram } from "lucide-react";
import SearchDropdown from "./SearchDropdown.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navigation = ({
  searchTerm = "",
  setSearchTerm = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {},
  products = [],
}) => {
  const { getTotalQuantity } = useCart();
  const cartItemCount = getTotalQuantity();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest("#mobile-menu") &&
        !event.target.closest('[aria-label="Toggle mobile menu"]')
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <nav
      className="nav-professional sticky top-0 z-50 shadow-lg bg-white"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center group"
              tabIndex={0}
              aria-label="Home"
            >
              <div
                className="mr-4 transition-transform duration-300 group-hover:scale-110"
                style={{ width: "250px", height: "250px" }}
              >
                <img
                  src="/kingsvg.svg"
                  alt="SneakrzKing Logo"
                  className="w-full h-full object-contain"
                  style={{ paddingRight: "86px" }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/") ? "font-semibold" : "hover:text-blue-600"
                }`}
                style={{ color: "rgba(30, 59, 96, 1)" }}
                tabIndex={0}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/products")
                    ? "font-semibold"
                    : "hover:text-blue-600"
                }`}
                style={{ color: "rgba(30, 59, 96, 1)" }}
                tabIndex={0}
              >
                Products
              </Link>
              <Link
                to="/brands"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/brands") ? "font-semibold" : "hover:text-blue-600"
                }`}
                style={{ color: "rgba(30, 59, 96, 1)" }}
                tabIndex={0}
              >
                Brands
              </Link>
              <Link
                to="/about"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/about") ? "font-semibold" : "hover:text-blue-600"
                }`}
                style={{ color: "rgba(30, 59, 96, 1)" }}
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

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchDropdown
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              products={products}
              className="w-64"
            />

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={handleMenuToggle}
              className={`p-2 rounded-lg transition-all duration-300 touch-target ${
                isMenuOpen
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              type="button"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="py-3">
              <SearchDropdown
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                products={products}
                onClose={() => setIsMenuOpen(false)}
                className="w-full"
              />
            </div>

            <Link
              to="/"
              onClick={handleMobileLinkClick}
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors touch-target"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={handleMobileLinkClick}
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors touch-target"
            >
              Products
            </Link>
            <Link
              to="/brands"
              onClick={handleMobileLinkClick}
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors touch-target"
            >
              Brands
            </Link>
            <Link
              to="/about"
              onClick={handleMobileLinkClick}
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors touch-target"
            >
              About
            </Link>
            <a
              href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleMobileLinkClick}
              className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-lg transition-colors touch-target"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
