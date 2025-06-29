import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../LoadingSpinner";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import {
  validateForm,
  validateField,
  checkoutValidationRules,
} from "../../utils/formValidation";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 80;
  const total = subtotal + shipping;

  // Initialize EmailJS with better error handling
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const initEmailJS = () => {
      if (window.emailjs) {
        console.log("EmailJS found, initializing...");
        try {
          window.emailjs.init("xZ-FMAkzHPph3aojg");
          console.log("EmailJS initialized successfully");
        } catch (error) {
          console.error("EmailJS initialization failed:", error);
        }
      } else {
        console.warn(
          `EmailJS not found on window object (attempt ${retryCount + 1}/${maxRetries})`,
        );
        retryCount++;

        if (retryCount < maxRetries) {
          // Try again with increasing delay
          setTimeout(initEmailJS, 1000 * retryCount);
        } else {
          console.error("EmailJS failed to load after maximum retries");
        }
      }
    };

    // Initial attempt
    initEmailJS();

    // Also try when window loads (for mobile browsers)
    const handleLoad = () => initEmailJS();
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Enhanced form validation function using utility
  const validateFormData = () => {
    // Create custom validation rules without the country requirement
    const customValidationRules = {
      firstName: checkoutValidationRules.firstName,
      lastName: checkoutValidationRules.lastName,
      email: checkoutValidationRules.email,
      phone: checkoutValidationRules.phone,
      streetAddress: checkoutValidationRules.streetAddress,
      city: checkoutValidationRules.city,
    };

    const formDataForValidation = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      streetAddress: formData.address,
      city: formData.city,
    };

    const validation = validateForm(
      formDataForValidation,
      customValidationRules,
    );
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Check if form is ready to submit
  const isFormReady = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
    ];
    const hasAllRequiredFields = requiredFields.every(
      (field) => formData[field] && formData[field].trim().length > 0,
    );
    const hasNoErrors =
      Object.keys(formErrors).length === 0 ||
      Object.values(formErrors).every((error) => !error);
    return hasAllRequiredFields && hasNoErrors;
  };

  // Real-time field validation
  const validateSingleField = (fieldName, value) => {
    const fieldMapping = {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      address: "streetAddress",
      city: "city",
    };

    const customValidationRules = {
      firstName: checkoutValidationRules.firstName,
      lastName: checkoutValidationRules.lastName,
      email: checkoutValidationRules.email,
      phone: checkoutValidationRules.phone,
      streetAddress: checkoutValidationRules.streetAddress,
      city: checkoutValidationRules.city,
    };

    const mappedFieldName = fieldMapping[fieldName];
    if (mappedFieldName) {
      const validation = validateField(
        mappedFieldName,
        value,
        customValidationRules,
      );
      if (!validation.isValid) {
        setFormErrors((prev) => ({
          ...prev,
          [fieldName]: validation.error,
        }));
      } else {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  // Send email confirmation
  const sendEmailConfirmation = async () => {
    if (!formData.email || !window.emailjs) {
      console.log("Email not provided or EmailJS not loaded");
      return;
    }

    try {
      console.log("=== EmailJS Debug Info ===");
      console.log("Attempting to send email to:", formData.email);
      console.log("Cart items:", cartItems);
      console.log("Original total from props:", total);
      console.log("Form data:", formData);

      // Calculate totals to ensure they're correct
      const calculatedSubtotal = cartItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 1;
        console.log(
          `Item: ${item.name}, Price: ${itemPrice}, Qty: ${itemQuantity}, Item Total: ${itemPrice * itemQuantity}`,
        );
        return sum + itemPrice * itemQuantity;
      }, 0);

      const shippingCost = 80;
      const calculatedTotal = calculatedSubtotal + shippingCost;

      console.log("Calculated subtotal:", calculatedSubtotal);
      console.log("Shipping cost:", shippingCost);
      console.log("Calculated total:", calculatedTotal);

      // Ensure we have proper values
      const customerName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const orderItemsList =
        cartItems.length > 0
          ? cartItems
              .map((item) => {
                const itemPrice = parseFloat(item.price) || 0;
                const itemQuantity = parseInt(item.quantity) || 1;
                const itemTotal = itemPrice * itemQuantity;
                return `• ${item.name || "Unknown Item"} - Size: ${item.selectedSize || "N/A"} - Qty: ${itemQuantity} - Price: ${itemTotal.toFixed(2)} EGP`;
              })
              .join("\n")
          : "No items in cart";

      const totalAmount = calculatedTotal.toFixed(2);
      const subtotalAmount = calculatedSubtotal.toFixed(2);

      console.log(
        "Final amounts - Subtotal:",
        subtotalAmount,
        "Total:",
        totalAmount,
      );

      const templateParams = {
        customer_name: customerName,
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim() || "Not provided",
        customer_address: `${formData.address.trim()}, ${formData.city.trim()}`,
        order_items: orderItemsList,
        subtotal_amount: subtotalAmount,
        shipping_amount: "80.00",
        total_amount: totalAmount,
        order_total: totalAmount, // Add this as backup
        order_notes: formData.notes.trim() || "No additional notes",
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        // Add more explicit values
        subtotal: `${subtotalAmount} EGP`,
        shipping: "80.00 EGP",
        total: `${totalAmount} EGP`,
      };

      console.log("=== Final Template Params ===");
      console.log(JSON.stringify(templateParams, null, 2));

      const response = await window.emailjs.send(
        "service_jpicl4m",
        "template_sd6o0td",
        templateParams,
      );

      console.log("Email sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Email sending failed:", error);
      console.error("Error details:", error.message);
      // Don't throw error - allow order to continue even if email fails
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation with debounce for better UX
    if (value.trim() !== "") {
      setTimeout(() => {
        validateSingleField(name, value);
      }, 500);
    } else {
      // Clear error if field is empty (except for required fields on blur)
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    // Clear general submit error
    if (submitError) {
      setSubmitError("");
    }
  };

  // Handle field blur for immediate required field validation
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    validateSingleField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validate form
    if (!validateFormData()) {
      setSubmitError(
        "Please fill in all required fields correctly before placing your order.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email confirmation if email is provided
      if (formData.email) {
        setEmailSentStatus("sending");
        const emailResult = await sendEmailConfirmation();
        setEmailSentStatus(emailResult ? "sent" : "failed");
      }

      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate order data
      const orderData = {
        orderNumber: Date.now().toString().slice(-8),
        customerInfo: formData,
        items: cartItems,
        total,
        orderDate: new Date().toLocaleDateString(),
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
      };

      // Store order for confirmation page
      localStorage.setItem("lastOrder", JSON.stringify(orderData));

      // Clear cart after successful order placement
      clearCart();
      console.log("Cart cleared after successful order placement");

      // Navigate to confirmation
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Order submission failed:", error);
      setSubmitError(
        "Order submission failed. Please check your information and try again.",
      );
    } finally {
      setIsSubmitting(false);
      setEmailSentStatus(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No items to checkout
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="bg-navy-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-700 transition-colors"
              style={{ backgroundColor: "#002b5e" }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 checkout-container">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 checkout-form">
            <h2 className="text-xl font-semibold mb-6">Billing Information</h2>

            {/* Error Display */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Error</h4>
                  <p className="text-red-700">{submitError}</p>
                </div>
              </div>
            )}

            {/* Email Status */}
            {emailSentStatus && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 email-status-message ${
                  emailSentStatus === "sent"
                    ? "bg-green-50 border border-green-200"
                    : emailSentStatus === "failed"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-blue-50 border border-blue-200"
                }`}
              >
                {emailSentStatus === "sending" && (
                  <LoadingSpinner size="sm" className="mt-0.5 flex-shrink-0" />
                )}
                {emailSentStatus === "sent" && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                {emailSentStatus === "failed" && (
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm leading-relaxed ${
                      emailSentStatus === "sent"
                        ? "text-green-700"
                        : emailSentStatus === "failed"
                          ? "text-yellow-700"
                          : "text-blue-700"
                    }`}
                  >
                    {emailSentStatus === "sending" &&
                      "Sending confirmation email..."}
                    {emailSentStatus === "sent" &&
                      "Confirmation email sent successfully! Check your inbox."}
                    {emailSentStatus === "failed" &&
                      "Could not send confirmation email, but your order will still be processed."}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    required
                    placeholder="Enter your first name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.firstName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    required
                    placeholder="Enter your last name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.lastName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                  <span className="text-xs text-gray-500 block mt-1">
                    Receive order confirmation via email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  placeholder="your@email.com (optional)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  style={{ fontSize: "16px", minHeight: "48px" }}
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600 form-error-message">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                  <span className="text-xs text-gray-500 block mt-1">
                    Egyptian mobile number (e.g., 01234567890 or +201234567890)
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  required
                  placeholder="01234567890 or +201234567890"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  required
                  placeholder="Street address, building number, apartment"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.address
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  required
                  placeholder="Enter your city"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.city
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special instructions..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 place-order-button button-loading"
                style={{
                  backgroundColor: "#002b5e",
                  minHeight: "48px",
                  fontSize: "16px",
                  touchAction: "manipulation",
                }}
                onMouseEnter={(e) =>
                  !isSubmitting && (e.target.style.backgroundColor = "#001a3d")
                }
                onMouseLeave={(e) =>
                  !isSubmitting && (e.target.style.backgroundColor = "#002b5e")
                }
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                <span>
                  {isSubmitting ? "Processing Order..." : "Place Order"}
                </span>
              </button>

              {/* Form status indicator */}
              {!isFormReady() && Object.keys(formErrors).length === 0 && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Please fill in all required fields to place your order
                </p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.selectedSize}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {item.price * item.quantity} EGP
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping} EGP</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>{total} EGP</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Payment:</strong> Cash on delivery
              </p>
              <p className="text-sm text-blue-800 mt-1">
                <strong>Delivery:</strong> 3-5 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
