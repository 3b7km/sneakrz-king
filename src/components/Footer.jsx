import { Instagram, Phone, ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="relative text-white py-20"
      style={{ backgroundColor: "#1E3B60" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section - Enhanced */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="/kingsvg.svg"
                alt="SneakrzKing Logo"
                className="filter brightness-0 invert transition-transform duration-300 hover:scale-105 ml-0 mr-auto"
                style={{ width: "300px", height: "250px" }}
              />
            </div>
            <p className="text-blue-100 text-base leading-relaxed font-light">
              Your premier destination for authentic sneakers from the world's
              most prestigious brands.
              <span className="block mt-2 text-white font-medium">
                Step into greatness with every purchase.
              </span>
            </p>

            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon group bg-gradient-to-r from-pink-500 to-orange-500 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
              >
                <Instagram className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="https://wa.me/201091968021"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon group bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/25"
              >
                <Phone className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b border-blue-500/30 pb-3">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/mens-shoes", label: "Men's Shoes" },
                { href: "/womens-shoes", label: "Women's Shoes" },
                { href: "/brands", label: "Brands" },
                { href: "/about", label: "About" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="footer-link group text-blue-200 hover:text-white transition-all duration-300 flex items-center gap-3 text-base font-medium"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-white transition-colors duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/cart"
                  className="footer-link group text-blue-200 hover:text-white transition-all duration-300 flex items-center gap-3 text-base font-medium"
                >
                  <ShoppingBag className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors duration-300" />
                  Cart
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Info - Enhanced */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b border-blue-500/30 pb-3">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base">Phone</p>
                  <p className="text-blue-200">+20 109 196 8021</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Instagram className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base">
                    Instagram
                  </p>
                  <p className="text-blue-200">@sneakrz.king</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-gradient-to-r border-blue-500/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-blue-200 text-base">
                © 2025{" "}
                <span className="text-white font-semibold">Sneakrz King</span>.
                All rights reserved.
              </p>
              <p className="text-blue-300 text-sm mt-1">
                Created by{" "}
                <a
                  href="https://www.instagram.com/ki9yj?igsh=MXh4cGZqcWhoZW50Zg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors duration-300 font-medium"
                >
                  @Ki9yj
                </a>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6">
              <div className="text-center"></div>
              <div className="text-center"></div>
              <div className="text-center"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
