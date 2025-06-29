import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Instagram } from "lucide-react";
import SearchDropdown from "./SearchDropdown.jsx";

const Navigation = ({
  cartItems = [],
  searchTerm = "",
  setSearchTerm = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {},
}) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleMobileLinkClick = () => setIsMenuOpen(false);

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
                style={{ width: "300px", height: "250px" }}
              >
                <img
                  src="/kingsvg.svg"
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
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                tabIndex={0}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/products")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                tabIndex={0}
              >
                Products
              </Link>
              <Link
                to="/brands"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/brands")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                tabIndex={0}
              >
                Brands
              </Link>
              <Link
                to="/about"
                className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/about")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search sneakers"
              />
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
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
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sneakers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search sneakers"
                  />
                </div>
              </div>

              <Link
                to="/"
                onClick={handleMobileLinkClick}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={handleMobileLinkClick}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Products
              </Link>
              <Link
                to="/brands"
                onClick={handleMobileLinkClick}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Brands
              </Link>
              <Link
                to="/about"
                onClick={handleMobileLinkClick}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                About
              </Link>
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMobileLinkClick}
                className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
