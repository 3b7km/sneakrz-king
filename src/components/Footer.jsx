import { Instagram, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fcb0376fc8e71411c9ebb0a3533b4d888%2F9d94d31e894f47c7ab1bcdd0297a87c3"
                alt="SneakrzKing Logo"
                className="w-12 h-12 mr-3"
              />
              <h3 className="text-xl font-bold">Sneakrz King</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your premier destination for authentic sneakers from the world's
              leading brands.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://wa.me/201091968021"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <p className="text-gray-400">
                <strong>Phone:</strong> +20 109 196 8021
              </p>
              <p className="text-gray-400">
                <strong>Instagram:</strong> @sneakrz.king
              </p>
              <p className="text-gray-400">
                <strong>Hours:</strong> Mon-Fri 9AM-8PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Sneakrz King. All rights reserved. | 100% Authentic Sneakers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
