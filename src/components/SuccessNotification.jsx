import { useEffect } from "react";
import { X } from "lucide-react";

const SuccessNotification = ({ message, onViewCart, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-fadeInUp">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-green-500 text-sm">✓</span>
            </div>
            <span className="font-medium">{message}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onViewCart}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
