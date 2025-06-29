import { Instagram, Phone, ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="text-white py-16"
      style={{ backgroundColor: "rgba(30, 59, 96, 1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand - Left position */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/kingsvg.svg"
                alt="SneakrzKing Logo"
                className="mr-3 filter brightness-0 invert"
                style={{ width: "300px", height: "233px" }}
              />
              <div></div>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Your premier destination for authentic sneakers from the world's
              leading brands.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/201091968021"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Middle position */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/mens-shoes"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Men's Shoes
                </a>
              </li>
              <li>
                <a
                  href="/womens-shoes"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women's Shoes
                </a>
              </li>
              <li>
                <a
                  href="/brands"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Brands
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Cart
                </a>
              </li>
            </ul>
          </div>

          {/* Contact - Right position */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="font-medium text-white">Phone:</span> +20 109
                196 8021
              </p>
              <p className="text-gray-400">
                <span className="font-medium text-white">Instagram:</span>{" "}
                @sneakrz.king
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Separate from main footer content */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Sneakrz King. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
