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

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Customer Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`item-${item.id || index}-${item.selectedSize || "default"}`}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
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
                className="w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
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
