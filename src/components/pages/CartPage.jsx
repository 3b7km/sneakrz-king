import { useNavigate } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { LoadingSpinner } from "../LoadingSpinner";
import { useState } from "react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [loadingStates, setLoadingStates] = useState({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 80;
  const total = subtotal + shipping;

  const handleQuantityUpdate = async (itemId, selectedSize, newQuantity) => {
    const loadingKey = `quantity-${itemId}-${selectedSize}`;
    setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      // Add small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateQuantity(itemId, selectedSize, newQuantity);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleRemoveItem = async (itemId, selectedSize) => {
    const loadingKey = `remove-${itemId}-${selectedSize}`;
    setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      removeItem(itemId, selectedSize);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">🛒</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some sneakers to get started!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="text-white px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: "#002b5e" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#001a3d")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#002b5e")}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8 px-2">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="p-4 md:p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600">
                            {item.brand}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {item.selectedSize}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-start">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item.id,
                                item.selectedSize,
                                item.quantity - 1,
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              loadingStates[
                                `quantity-${item.id}-${item.selectedSize}`
                              ]
                            }
                            className="cart-quantity-btn p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            aria-label="Decrease quantity"
                          >
                            {loadingStates[
                              `quantity-${item.id}-${item.selectedSize}`
                            ] ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Minus className="w-4 h-4" />
                            )}
                          </button>
                          <span className="w-10 md:w-12 text-center font-medium bg-gray-50 px-2 md:px-3 py-2 rounded-md border text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item.id,
                                item.selectedSize,
                                item.quantity + 1,
                              )
                            }
                            disabled={
                              loadingStates[
                                `quantity-${item.id}-${item.selectedSize}`
                              ]
                            }
                            className="cart-quantity-btn p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            aria-label="Increase quantity"
                          >
                            {loadingStates[
                              `quantity-${item.id}-${item.selectedSize}`
                            ] ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between md:justify-end md:space-x-4">
                          <div className="text-right">
                            <p className="text-base md:text-lg font-medium text-gray-900">
                              {item.price * item.quantity} EGP
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              {item.price} EGP each
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveItem(item.id, item.selectedSize)
                            }
                            disabled={
                              loadingStates[
                                `remove-${item.id}-${item.selectedSize}`
                              ]
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                            aria-label="Remove item from cart"
                          >
                            {loadingStates[
                              `remove-${item.id}-${item.selectedSize}`
                            ] ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping} EGP</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>{total} EGP</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="cart-action-btn w-full text-white py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: "#002b5e" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#001a3d")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#002b5e")
                  }
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="cart-action-btn w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
