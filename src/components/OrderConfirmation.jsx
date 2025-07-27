import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Clock,
  Truck,
  Star,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    // Get order data from navigation state or localStorage
    const orderInfo =
      location.state?.orderData ||
      JSON.parse(localStorage.getItem("lastOrder") || "null");

    if (!orderInfo) {
      // Redirect to home if no order data
      navigate("/");
      return;
    }

    setOrderData(orderInfo);

    // Ensure cart is cleared (backup in case checkout didn't clear it)
    clearCart();

    // Clear the order data from localStorage after displaying
    setTimeout(() => {
      localStorage.removeItem("lastOrder");
    }, 1000);
  }, [location.state, navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const {
    orderNumber,
    customerInfo,
    items,
    total,
    orderDate,
    estimatedDelivery,
  } = orderData;

  const getDeliverySteps = () => [
    {
      title: "Order Confirmed",
      description: "We've received your order",
      icon: CheckCircle,
      completed: true,
      date: orderDate,
    },
    {
      title: "Preparing Order",
      description: "We're getting your items ready",
      icon: Package,
      completed: false,
      date: "Within 1-2 business days",
    },
    {
      title: "In Transit",
      description: "Your order is on its way",
      icon: Truck,
      completed: false,
      date: "2-3 business days",
    },
    {
      title: "Delivered",
      description: "Enjoy your new sneakers!",
      icon: Star,
      completed: false,
      date: estimatedDelivery,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-6 md:mb-8 flex justify-center overflow-x-auto pb-2">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-max px-4">
            <div className="flex items-center">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-semibold text-xs md:text-sm">
                1
              </div>
              <span className="ml-2 md:ml-3 font-medium text-gray-800 text-sm md:text-base whitespace-nowrap">
                CART
              </span>
            </div>
            <div className="w-4 md:w-6 h-0.5 bg-gray-400"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-semibold text-xs md:text-sm">
                2
              </div>
              <span className="ml-2 md:ml-3 font-medium text-gray-800 text-sm md:text-base whitespace-nowrap">
                CHECKOUT
              </span>
            </div>
            <div className="w-4 md:w-6 h-0.5 bg-gray-400"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-xs md:text-sm">
                3
              </div>
              <span className="ml-2 md:ml-3 font-medium text-blue-900 text-sm md:text-base whitespace-nowrap">
                CONFIRMED
              </span>
            </div>
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 md:h-24 md:w-24 rounded-full bg-green-100 mb-4 md:mb-6">
            <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Order Confirmed!
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto">
            Thank you for your purchase. We'll send you updates via WhatsApp.
          </p>
          <div className="bg-white rounded-lg shadow-sm border-2 border-green-200 px-4 md:px-6 py-3 md:py-4 inline-block">
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              Order Number
            </p>
            <p className="text-xl md:text-2xl font-bold text-green-600">
              #{orderNumber}
            </p>
          </div>
        </div>

        {/* Screenshot Sharing Message - Moved to Top */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8 mx-2 sm:mx-0">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-purple-900 mb-2">
                🚨 IMPORTANT: Share Your Order with us to ensure we received your order!
              </h3>
              <p className="text-sm md:text-base text-purple-800 mb-3">
                Help us spread the love! Take a screenshot of this order confirmation and share it with us to confirm your order was processed successfully.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <a
                  href="https://wa.me/201091968021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2 md:px-4 md:py-2 bg-green-500 hover:bg-green-600 text-white text-sm md:text-base font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                  </svg>
                  Send via WhatsApp
                </a>
                {customerInfo.instagram && (
                  <a
                    href="https://www.instagram.com/sneakrz.king"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm md:text-base font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Send via Instagram
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {customerInfo.firstName && customerInfo.lastName
                      ? `${customerInfo.firstName} ${customerInfo.lastName}`
                      : customerInfo.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">
                    {customerInfo.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">
                    {customerInfo.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instagram</p>
                  <p className="font-medium">
                    {customerInfo.instagram ? `@${customerInfo.instagram}` : "Not provided"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-medium">
                    {customerInfo.address && customerInfo.city
                      ? `${customerInfo.address}, ${customerInfo.city}`
                      : "Not provided"}
                  </p>
                </div>
              </div>
              {customerInfo.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Order Notes</p>
                  <p className="font-medium">{customerInfo.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
                Order Items
              </h3>
              <div className="space-y-3 md:space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`item-${item.id || index}-${item.selectedSize || "default"}`}
                    className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 md:p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600">
                          {item.brand}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Size: {item.selectedSize} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        {item.price * item.quantity} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                What happens next?
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  We'll contact you via WhatsApp to confirm your order details
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Your order will be prepared and packaged with care
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  You'll receive tracking information once shipped
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Enjoy your authentic sneakers!
                </li>
              </ul>
            </div>

            {/* Screenshot Sharing Message */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    📸 Share Your Order!
                  </h3>
                  <p className="text-purple-800 mb-3">
                    Help us spread the love! Take a screenshot of this order confirmation and share it with us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.me/201091968021"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                      </svg>
                      Send via WhatsApp
                    </a>
                    {customerInfo.instagram && (
                      <a
                        href="https://www.instagram.com/sneakrz.king"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Send via Instagram
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-purple-700 mt-3">
                    💜 Tag us @sneakrz_king in your stories and get featured!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Delivery Timeline */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{total - 80} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">80 EGP</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-green-600">
                      {total} EGP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Timeline</h3>
              <div className="space-y-4">
                {getDeliverySteps().map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={`delivery-step-${step.name || step.title || index}`}
                      className="flex items-start space-x-3"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            step.completed ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            step.completed ? "text-green-900" : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/products")}
                className="cart-action-btn w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: "#002b5e" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#001a3d")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#002b5e")
                }
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <a
                href="https://wa.me/201091968021"
                target="_blank"
                rel="noopener noreferrer"
                className="cart-action-btn w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
              >
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
