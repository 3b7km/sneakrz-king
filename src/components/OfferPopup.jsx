import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Gift } from 'lucide-react';

const OfferPopup = ({ isVisible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100 rounded-3xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100 rotate-0' : 'scale-95 opacity-0 rotate-1'
        }`}
        style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f9a8d4 100%)',
          boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-300 rounded-full opacity-20"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-rose-300 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 -right-2 w-8 h-8 bg-pink-400 rounded-full opacity-25"></div>
        </div>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 hover:scale-110 z-20"
          aria-label="Close offer"
          type="button"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-8 text-center relative z-10">
          {/* Header with sparkles */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Gift className="w-12 h-12 text-pink-500" />
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-pink-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Special Offer
            </span>
            <Heart className="inline-block w-6 h-6 text-pink-500 ml-2 animate-pulse" />
          </h2>

          <p className="text-pink-600 font-medium mb-6">
            Just for our lovely ladies! 💕
          </p>

          {/* Offer details */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-pink-200">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-800">3000 EGP</span>
                <span className="text-lg text-gray-500 line-through ml-2">3200 EGP</span>
              </div>
              
              <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                Save 200 EGP + FREE Shipping! 🚚
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">✨ Limited time offer on women's collection</p>
                <p>💝 Free shipping on orders over 3000 EGP</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
              boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
            }}
          >
            Shop Women's Collection Now! 🛍️
          </button>

          {/* Fine print */}
          <p className="text-xs text-gray-500 mt-4">
            *Offer valid for women's shoes only. Limited time.
          </p>
        </div>

        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 -z-10">
          <div className="w-full h-full bg-white rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;
