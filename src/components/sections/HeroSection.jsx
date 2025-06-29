import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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
    <section className="hero-section-enhanced relative overflow-hidden bg-white min-h-screen flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-10"
          poster="https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F0f4530de78a647deb471d412dfb4a0d7?format=webp&width=1920"
        >
          <source src="/logo3d.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-50/80 to-white/80"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-gray-900 space-y-8">
            <div className="space-y-4">
              <h1
                className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                style={{ color: "#1E3B60" }}
              >
                Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                  Sneakers
                </span>
                <span className="block">Collection</span>
              </h1>

              <p className="hero-subtitle text-xl md:text-2xl text-gray-600 leading-relaxed max-w-lg">
                Discover authentic sneakers from the world's most prestigious
                brands. Experience style, comfort, and authenticity in every
                step.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToProducts}
                className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1E3B60", color: "white" }}
              >
                Shop Collection
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/mens-shoes")}
                className="border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  borderColor: "#1E3B60",
                  color: "#1E3B60",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1E3B60";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#1E3B60";
                }}
              >
                Men's Collection
              </button>

              <button
                onClick={() => navigate("/womens-shoes")}
                className="border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  borderColor: "#1E3B60",
                  color: "#1E3B60",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1E3B60";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#1E3B60";
                }}
              >
                Women's Collection
              </button>
            </div>
          </div>

          {/* Right Content - Featured Product Showcase */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full blur-3xl transform scale-150"></div>

              {/* Featured Product */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-2xl">
                <div className="text-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F0f4530de78a647deb471d412dfb4a0d7?format=webp&width=400"
                    alt="Featured Sneaker"
                    className="w-64 h-64 object-contain mx-auto mb-4 transform hover:scale-110 transition-transform duration-300"
                    loading="eager"
                  />
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#1E3B60" }}
                  >
                    Featured Product
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Nike Air Force 1 '07
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-gray-700 text-sm ml-2">(4.8)</span>
                  </div>
                  <button
                    className="px-6 py-2 rounded-lg font-medium transition-colors text-white"
                    style={{ backgroundColor: "#1E3B60" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#2C5F87")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#1E3B60")
                    }
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToProducts}
          className="animate-bounce transition-colors"
          style={{ color: "#1E3B60" }}
          onMouseEnter={(e) => (e.target.style.color = "#2C5F87")}
          onMouseLeave={(e) => (e.target.style.color = "#1E3B60")}
          aria-label="Scroll to products"
        >
          <ChevronRight className="w-6 h-6 transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
