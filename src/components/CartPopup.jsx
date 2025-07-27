import { useState } from "react";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";

const CartPopup = ({ isOpen, onClose }) => {
  const { cartItems, getTotalPrice, getAF1Discount, updateQuantity, removeItem } = useCart();
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpdateQuantity = async (itemId, selectedSize, newQuantity) => {
    const loadingKey = `${itemId}-${selectedSize}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    try {
      updateQuantity(itemId, selectedSize, newQuantity);
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleRemoveItem = async (itemId, selectedSize) => {
    const loadingKey = `${itemId}-${selectedSize}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    try {
      removeItem(itemId, selectedSize);
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };



  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cartItems.length})
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={`${item.id}-${item.selectedSize}`}
                item={item}
                onUpdateQuantity={(newQuantity) => 
                  handleUpdateQuantity(item.id, item.selectedSize, newQuantity)
                }
                onRemove={() => handleRemoveItem(item.id, item.selectedSize)}
                isLoading={loadingStates[`${item.id}-${item.selectedSize}`]}
              />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {getAF1Discount() > 0 && (
              <div className="flex justify-between text-pink-600 font-medium">
                <span>AF1 Special Offer (15% OFF)</span>
                <span>-{getAF1Discount()} EGP</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{getTotalPrice()} EGP</span>
            </div>

            {getAF1Discount() > 0 && (
              <p className="text-sm text-pink-600 text-center">
                You saved {getAF1Discount()} EGP on AF1 shoes!
              </p>
            )}

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/cart");
                  onClose();
                }}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                View Cart
              </button>
              <button
                onClick={() => {
                  navigate("/checkout");
                  onClose();
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
