import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { LoadingSpinner } from "../LoadingSpinner";
import { AlertCircle, CheckCircle } from "lucide-react";
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
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 80;
  const total = subtotal + shipping;

  // Initialize EmailJS with enhanced error handling
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 15;
    let emailJSReady = false;

    const initEmailJS = () => {
      console.log(`EmailJS init attempt ${retryCount + 1}/${maxRetries}`);

      // Check if EmailJS script is loaded
      if (typeof window.emailjs === 'undefined') {
        console.log("EmailJS script not loaded yet, checking CDN...");
        retryCount++;
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * retryCount, 5000); // Cap at 5 seconds
          console.log(`Retrying EmailJS init in ${delay}ms`);
          setTimeout(initEmailJS, delay);
        } else {
          console.error("EmailJS CDN failed to load after maximum retries");
          console.error("This may be due to network restrictions or ad blockers");
          window._emailJSFailed = true;
        }
        return false;
      }

      if (window.emailjs && !emailJSReady) {
        try {
          // Test EmailJS service availability
          if (typeof window.emailjs.init !== 'function') {
            throw new Error("EmailJS init function not available");
          }

          window.emailjs.init("xZ-FMAkzHPph3aojg");
          emailJSReady = true;
          window._emailJSReady = true;
          console.log("✅ EmailJS initialized successfully");

          // Test service connection
          console.log("🔍 Testing EmailJS service connection...");
          return true;
        } catch (error) {
          console.error("❌ EmailJS initialization failed:", error.message);
          console.error("Full error:", error);
          retryCount++;
          if (retryCount < maxRetries) {
            const delay = 2000;
            console.log(`🔄 Retrying initialization in ${delay}ms`);
            setTimeout(initEmailJS, delay);
          } else {
            window._emailJSFailed = true;
          }
          return false;
        }
      }
      return emailJSReady;
    };

    // Multiple initialization strategies for better compatibility
    const initStrategies = [
      () => initEmailJS(), // Immediate
      () => setTimeout(initEmailJS, 500), // Short delay
      () => setTimeout(initEmailJS, 1500), // Medium delay
      () => setTimeout(initEmailJS, 3000), // Long delay
    ];

    // Execute all strategies
    initStrategies.forEach((strategy, index) => {
      setTimeout(strategy, index * 200);
    });

    // Window load event listener
    const handleLoad = () => {
      console.log("Window loaded, attempting EmailJS initialization");
      setTimeout(initEmailJS, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    // Cleanup
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // EmailJS diagnostic function
  const diagnoseEmailJS = () => {
    console.log("🔍 EmailJS Diagnostic Report:");
    console.log("================================");
    console.log("EmailJS Object:", !!window.emailjs);
    console.log("EmailJS Ready:", !!window._emailJSReady);
    console.log("EmailJS Failed:", !!window._emailJSFailed);
    console.log("Navigator Online:", navigator.onLine);
    console.log("User Agent:", navigator.userAgent);
    console.log("Cookie Enabled:", navigator.cookieEnabled);
    console.log("Current URL:", window.location.href);
    console.log("Protocol:", window.location.protocol);

    if (window.emailjs) {
      console.log("EmailJS Functions Available:");
      console.log("- init:", typeof window.emailjs.init);
      console.log("- send:", typeof window.emailjs.send);
      console.log("- sendForm:", typeof window.emailjs.sendForm);
    }

    // Check for common blockers
    const blockers = [];
    if (!navigator.onLine) blockers.push("No internet connection");
    if (window.location.protocol === 'file:') blockers.push("File protocol (should use http/https)");
    if (!navigator.cookieEnabled) blockers.push("Cookies disabled");

    if (blockers.length > 0) {
      console.warn("⚠️ Potential blockers detected:", blockers);
    }
    console.log("================================");
  };

  // Enhanced validation using utility functions
  const validateFormData = () => {
    const formDataForValidation = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      streetAddress: formData.address,
      city: formData.city,
    };

    const customValidationRules = {
      firstName: checkoutValidationRules.firstName,
      lastName: checkoutValidationRules.lastName,
      email: checkoutValidationRules.email,
      phone: checkoutValidationRules.phone,
      streetAddress: checkoutValidationRules.streetAddress,
      city: checkoutValidationRules.city,
    };

    const validation = validateForm(
      formDataForValidation,
      customValidationRules,
    );

    // Map validation errors back to form field names
    const mappedErrors = {};
    if (validation.errors.firstName)
      mappedErrors.firstName = validation.errors.firstName;
    if (validation.errors.lastName)
      mappedErrors.lastName = validation.errors.lastName;
    if (validation.errors.email) mappedErrors.email = validation.errors.email;
    if (validation.errors.phone) mappedErrors.phone = validation.errors.phone;
    if (validation.errors.streetAddress)
      mappedErrors.address = validation.errors.streetAddress;
    if (validation.errors.city) mappedErrors.city = validation.errors.city;

    setErrors(mappedErrors);
    return validation.isValid;
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
      // Skip validation for empty optional fields (like email)
      if (fieldName === "email" && (!value || value.trim() === "")) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return;
      }

      const validation = validateField(
        mappedFieldName,
        value,
        customValidationRules,
      );
      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: validation.error,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  // Check if form is ready
  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      Object.keys(errors).length === 0
    );
  };

  // Send email confirmation with enhanced diagnostics
  const sendEmailConfirmation = async () => {
    if (!formData.email) {
      console.log("📧 Email not provided, skipping email confirmation");
      return null;
    }

    console.log("🚀 Starting email confirmation process...");
    console.log("📧 Recipient email:", formData.email);

    try {
      // Enhanced EmailJS readiness check
      const waitForEmailJS = () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 30; // Increased for slower networks

          console.log("⏳ Waiting for EmailJS to be ready...");

          const checkEmailJS = () => {
            attempts++;
            console.log(`🔍 EmailJS check attempt ${attempts}/${maxAttempts}`);

            if (window.emailjs && window._emailJSReady) {
              console.log("✅ EmailJS is ready!");
              resolve(true);
            } else if (window._emailJSFailed) {
              console.error("❌ EmailJS initialization previously failed");
              reject(new Error("EmailJS failed to initialize - may be blocked by network or browser"));
            } else if (attempts >= maxAttempts) {
              console.error("⏰ EmailJS timeout after", maxAttempts, "attempts");
              reject(new Error("EmailJS timeout - service may be unavailable"));
            } else {
              // Log current state for debugging
              console.log("🔄 EmailJS status:", {
                emailjsExists: !!window.emailjs,
                emailjsReady: !!window._emailJSReady,
                emailjsFailed: !!window._emailJSFailed,
                attempt: attempts
              });
              setTimeout(checkEmailJS, 750); // Slightly longer interval
            }
          };
          checkEmailJS();
        });
      };

      await waitForEmailJS();

      // Additional safety checks
      if (!window.emailjs) {
        throw new Error("EmailJS object not found - CDN may be blocked");
      }

      if (typeof window.emailjs.send !== 'function') {
        throw new Error("EmailJS send function not available");
      }

      const calculatedSubtotal = cartItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 1;
        return sum + itemPrice * itemQuantity;
      }, 0);

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

      const templateParams = {
        customer_name: customerName,
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim() || "Not provided",
        customer_address: `${formData.address.trim()}, ${formData.city.trim()}`,
        order_items: orderItemsList,
        subtotal_amount: calculatedSubtotal.toFixed(2),
        shipping_amount: "80.00",
        total_amount: total.toFixed(2),
        order_total: total.toFixed(2),
        order_notes: formData.notes.trim() || "No additional notes",
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        subtotal: `${calculatedSubtotal.toFixed(2)} EGP`,
        shipping: "80.00 EGP",
        total: `${total.toFixed(2)} EGP`,
      };

      console.log("📧 Preparing to send email via EmailJS...");
      console.log("🔧 Service ID: service_jpicl4m");
      console.log("📋 Template ID: template_sd6o0td");
      console.log("📦 Template parameters:", {
        customer_name: templateParams.customer_name,
        customer_email: templateParams.customer_email,
        order_total: templateParams.order_total,
        itemCount: cartItems.length
      });

      // Test EmailJS service before sending
      try {
        console.log("🔍 Testing EmailJS service availability...");

        const response = await window.emailjs.send(
          "service_jpicl4m",
          "template_sd6o0td",
          templateParams,
          "xZ-FMAkzHPph3aojg" // Public key as 4th parameter for better compatibility
        );

        console.log("✅ Email sent successfully!");
        console.log("📊 EmailJS Response:", {
          status: response.status,
          text: response.text,
          timestamp: new Date().toISOString()
        });

        return response;
      } catch (sendError) {
        console.error("📧 Email sending failed at send step:");
        console.error("Error details:", {
          name: sendError.name,
          message: sendError.message,
          status: sendError.status,
          text: sendError.text
        });

        // Provide specific error messages for common issues
        if (sendError.status === 400) {
          console.error("❌ Bad Request - Check service ID, template ID, or template parameters");
        } else if (sendError.status === 401) {
          console.error("❌ Unauthorized - Check public key and service permissions");
        } else if (sendError.status === 402) {
          console.error("❌ Payment Required - EmailJS account may need billing setup");
        } else if (sendError.status === 429) {
          console.error("❌ Rate Limited - Too many emails sent recently");
        }

        throw sendError;
      }
    } catch (error) {
      console.error("💥 Email confirmation process failed:");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);

      // Log system information for debugging
      console.log("🖥️ System info:", {
        userAgent: navigator.userAgent,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });

      return null;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear submit error immediately
    if (submitError) {
      setSubmitError("");
    }

    // Real-time validation with debounce
    if (value.trim() !== "") {
      setTimeout(() => {
        validateSingleField(name, value);
      }, 300);
    } else {
      // Clear error if field is empty (except for required fields)
      const requiredFields = [
        "firstName",
        "lastName",
        "phone",
        "address",
        "city",
      ];
      if (errors[name] && !requiredFields.includes(name)) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Handle field blur for immediate validation
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    validateSingleField(name, value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    console.log("Form submitted");

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
        console.log("Starting email confirmation process");

        try {
          const emailResult = await sendEmailConfirmation();
          setEmailSentStatus(emailResult ? "sent" : "failed");
          console.log(
            "Email confirmation result:",
            emailResult ? "success" : "failed",
          );
        } catch (emailError) {
          console.error("Email confirmation error:", emailError);
          setEmailSentStatus("failed");
          // Continue with order processing even if email fails
        }
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
      try {
        localStorage.setItem("lastOrder", JSON.stringify(orderData));
        console.log("Order data stored successfully");
      } catch (storageError) {
        console.error("Local storage error:", storageError);
        // Continue anyway - order data can be reconstructed
      }

      // Clear cart after successful order placement
      clearCart();
      console.log("Cart cleared after successful order placement");

      // Small delay to ensure cart is cleared before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

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

  // Redirect if cart is empty
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Billing Information</h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Error</h4>
                  <p className="text-red-700">{submitError}</p>
                </div>
              </div>
            )}



            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="01234567890 or +201234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Street address, building number, apartment"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.city ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                  isSubmitting || !isFormValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Processing Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>

              {!isFormValid() && (
                <p className="text-center text-sm text-gray-600">
                  Please fill in all required fields to place your order
                </p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-center gap-4"
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
