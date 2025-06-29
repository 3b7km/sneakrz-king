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
    <section className="hero-section-enhanced relative overflow-hidden bg-black min-h-screen flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
          poster="https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F0f4530de78a647deb471d412dfb4a0d7?format=webp&width=1920"
        >
          <source src="/logo3d.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-black/40"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-8">
            Step Into Greatness
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
            Discover the authentic and greatest sneakers from top brands.
            Authentic products, fast delivery, and unmatched style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToProducts}
              className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              🛒 Shop Now
            </button>

            <button
              onClick={() => navigate("/products")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black"
            >
              View Collection
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToProducts}
          className="animate-bounce text-white hover:text-gray-300 transition-colors"
          aria-label="Scroll to products"
        >
          <ChevronRight className="w-6 h-6 transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
