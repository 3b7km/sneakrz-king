import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section-enhanced relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Video - 3D Logo */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src="/logo3d.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Enhanced Background Overlay */}#
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-end items-center">
        <div className="text-center">
          {/* Hero Text Content */}
          <div className="text-white space-y-10 animate-fadeInUp">
            <div className="space-y-8">
              {/* Inspirational Header Text */}
              <div className="text-center space-y-6 mb-12">
                <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fadeInUp flex flex-col">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white drop-shadow-2xl ml-auto pb-48">
                    <p>
                      Rise With{" "}
                      <strong
                        style={{
                          fontFamily: "'Montserrat', 'Khula', sans-serif",
                          fontWeight: 700,
                          letterSpacing: "1px",
                        }}
                      >
                        Every Step
                      </strong>
                    </p>
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-300 drop-shadow-2xl animate-fadeInUp animation-delay-200"></span>
                </h1>

                <p className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-blue-100 leading-relaxed max-w-4xl mx-auto font-light animate-fadeInUp animation-delay-400">
                  <span className="block mt-2 text-white/90 font-medium"></span>
                </p>
              </div>

              {/* Additional Motivational Text */}
              <div className="text-center space-y-4 animate-fadeInUp animation-delay-500">
                <h2 className="text-2xl md:text-3xl font-semibold text-white/90"></h2>
                <p className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed"></p>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp animation-delay-500"></div>

            {/* New Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fadeInUp animation-delay-1000">
              <div className="text-center space-y-3"></div>
              <div className="text-center space-y-3"></div>
              <div className="text-center space-y-3"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => navigate("/products")}
            className="hero-collection-btn group bg-gradient-to-r from-white to-blue-50 text-blue-900 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex flex-row items-center justify-center backdrop-blur-sm border border-white/20"
          >
            <span style={{ fontWeight: 700 }}>View Collection</span>
          </button>

          <button
            onClick={() => navigate("/brands")}
            className="hero-explore-btn border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:bg-white hover:text-blue-900 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
          >
            Explore Brands
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
//                 king 66