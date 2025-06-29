import { Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#002b5e] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info - Moved to first position */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-green-400" />
                <div>
                  <p className="font-medium">+20 109 196 8021</p>
                  <p className="text-sm text-gray-400">Call or WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <Instagram className="w-5 h-5 mr-3 text-pink-400" />
                <div>
                  <p className="font-medium">@sneakrz.king</p>
                  <p className="text-sm text-gray-400">Follow us</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brand - Moved to center */}
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <img
                src="/kingsvg.svg"
                alt="SneakrzKing Logo"
                className="mr-3 filter brightness-0 invert"
                style={{ width: "60px", height: "60px" }}
              />
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sneakrz King
                </h3>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your premier destination for authentic sneakers from the world's
              leading brands. Quality, authenticity, and style guaranteed.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://wa.me/201091968021"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links - Moved to right */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/mens-shoes"
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Men's Shoes
                </a>
              </li>
              <li>
                <a
                  href="/womens-shoes"
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Women's Shoes
                </a>
              </li>
              <li>
                <a
                  href="/brands"
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Brands
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
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
