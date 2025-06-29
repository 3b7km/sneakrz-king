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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-500">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateCartItem(
                              item.id,
                              item.selectedSize,
                              item.quantity - 1,
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartItem(
                              item.id,
                              item.selectedSize,
                              item.quantity + 1,
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">
                          {item.price * item.quantity} EGP
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price} EGP each
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.selectedSize)
                        }
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
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
            <div className="bg-white rounded-lg shadow-sm p-6">
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
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors"
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
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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
