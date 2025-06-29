import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const scrollToProducts = () => {
    const productsSection = document.getElementById("featured-collection");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="hero-section-enhanced relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 min-h-screen flex items-center">
      {/* Background Video - More Visible */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
          poster="https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F0f4530de78a647deb471d412dfb4a0d7?format=webp&width=1920"
        >
          <source src="/logo3d.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 to-transparent"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Step Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                  Greatness
                </span>
              </h1>

              <p className="hero-subtitle text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Discover authentic sneakers from the world's most prestigious
                brands. Experience style, comfort, and authenticity in every
                step.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Shop Collection with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button
                  onClick={scrollToProducts}
                  className="group bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  View Collection
                  <ChevronDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-30">
                    <button
                      onClick={() => navigate("/products?gender=men")}
                      className="w-full px-6 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 font-medium"
                    >
                      Men's Collection
                    </button>
                    <button
                      onClick={() => navigate("/products?gender=women")}
                      className="w-full px-6 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 font-medium border-t border-gray-100"
                    >
                      Women's Collection
                    </button>
                  </div>
                )}
              </div>

              {/* Secondary CTA */}
              <button
                onClick={() => navigate("/brands")}
                className="border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-blue-300 hover:text-blue-900 transform hover:scale-105"
              >
                Explore Brands
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToProducts}
          className="animate-bounce text-white hover:text-blue-200 transition-colors"
          aria-label="Scroll to products"
        >
          <ChevronRight className="w-6 h-6 transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
