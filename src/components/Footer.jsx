import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  CreditCard,
  Truck,
  HeadphonesIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="text-white py-16"
      style={{ backgroundColor: "rgba(30, 59, 96, 1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

          {/* Quick Links - Second column */}
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
            </ul>
          </div>

          {/* Customer Service - Third column */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/cart"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shopping Cart
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Payment Methods
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  Customer Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact - Fourth column */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Phone:</span>
                  </p>
                  <p className="text-gray-300">+20 109 196 8021</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Instagram className="w-4 h-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Instagram:</span>
                  </p>
                  <p className="text-gray-300">@sneakrz.king</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Email:</span>
                  </p>
                  <p className="text-gray-300">info@sneakrzking.com</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Location:</span>
                  </p>
                  <p className="text-gray-300">Cairo, Egypt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Separate from main footer content */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Sneakrz King. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
