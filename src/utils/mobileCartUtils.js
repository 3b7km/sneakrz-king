// Mobile Cart Utilities for Enhanced UX

export const hapticFeedback = () => {
  // Provide haptic feedback on supported devices
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const preventZoom = () => {
  // Prevent pinch-to-zoom on form inputs
  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );
};

export const optimizeTouch = () => {
  // Add touch optimization for better mobile performance
  const style = document.createElement("style");
  style.textContent = `
    * {
      -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    
    button, input, select, textarea {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
    
    .cart-quantity-btn:active,
    .cart-action-btn:active {
      transform: scale(0.95);
      transition: transform 0.1s ease;
    }
  `;
  document.head.appendChild(style);
};

export const initMobileEnhancements = () => {
  // Initialize all mobile enhancements
  preventZoom();
  optimizeTouch();

  // Add loading states class management
  window.showCartLoading = (message = "Updating...") => {
    const loader = document.createElement("div");
    loader.id = "cart-loader";
    loader.className =
      "fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center";
    loader.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-lg text-center">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">${message}</p>
      </div>
    `;
    document.body.appendChild(loader);
  };

  window.hideCartLoading = () => {
    const loader = document.getElementById("cart-loader");
    if (loader) {
      loader.remove();
    }
  };
};

export default {
  hapticFeedback,
  smoothScrollToTop,
  preventZoom,
  optimizeTouch,
  initMobileEnhancements,
};
