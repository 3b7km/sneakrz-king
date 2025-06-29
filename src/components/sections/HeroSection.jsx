import { useNavigate } from "react-router-dom";
import { ChevronRight, Star, Shield, Truck } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

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
    <section className="hero-section-enhanced relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen flex items-center">
      <div className="absolute inset-0 z-0"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Step Into
                <span className="block" style={{ color: "#1e3b60" }}>
                  Greatness
                </span>
              </h1>

              <p className="hero-subtitle text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Discover authentic sneakers from the world's most prestigious
                brands. Experience style, comfort, and authenticity in every
                step.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToProducts}
                className="group bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Shop Collection
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/products")}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-black transform hover:scale-105"
              >
                Men's Collection
              </button>

              <button
                onClick={() => navigate("/products")}
                className="border-2 border-orange-400 text-orange-400 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-orange-400 hover:text-black transform hover:scale-105"
              >
                Women's Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToProducts}
          className="animate-bounce text-white hover:text-orange-400 transition-colors"
          aria-label="Scroll to products"
        >
          <ChevronRight className="w-6 h-6 transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
