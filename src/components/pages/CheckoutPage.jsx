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

  // Initialize EmailJS with enhanced iPhone Safari compatibility
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 15; // Increased for iOS
    let initTimer;
    let emailJSReady = false;

    // Detect iOS/iPhone specifically
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;

    console.log("=== EmailJS Initialization Debug ===");
    console.log("User Agent:", navigator.userAgent);
    console.log("Is iOS:", isIOS);
    console.log("Is Safari:", isSafari);
    console.log("Is iOS Safari:", isIOSSafari);

    const initEmailJS = () => {
      // Check for EmailJS availability
      if (window.emailjs && !emailJSReady) {
        console.log("EmailJS found, initializing...");
        try {
          window.emailjs.init("xZ-FMAkzHPph3aojg");
          emailJSReady = true;
          console.log("EmailJS initialized successfully");

          // Store initialization status for later use
          window._emailJSReady = true;
          return true;
        } catch (error) {
          console.error("EmailJS initialization failed:", error);
          return false;
        }
      } else if (!window.emailjs) {
        console.warn(
          `EmailJS not found on window object (attempt ${retryCount + 1}/${maxRetries})`,
        );
        retryCount++;

        if (retryCount < maxRetries) {
          // iOS Safari specific: Use much longer delays and progressive backoff
          let delay;
          if (isIOSSafari) {
            delay = Math.min(3000 * retryCount, 15000); // Much longer delays for iOS Safari
          } else if (isSafari) {
            delay = Math.min(2000 * retryCount, 10000); // Regular Safari delays
          } else {
            delay = 1000 * retryCount; // Standard delays for other browsers
          }

          console.log(
            `Retrying EmailJS init in ${delay}ms (attempt ${retryCount})`,
          );
          initTimer = setTimeout(initEmailJS, delay);
        } else {
          console.error("EmailJS failed to load after maximum retries");
          // Mark as failed but continue
          window._emailJSFailed = true;
        }
        return false;
      }
      return emailJSReady;
    };

    // Enhanced initialization strategies for iOS Safari
    const strategies = [
      // Immediate attempt
      () => {
        console.log("Strategy 1: Immediate attempt");
        return initEmailJS();
      },
      // DOM ready
      () => {
        console.log("Strategy 2: DOM ready");
        if (document.readyState === "complete") {
          return initEmailJS();
        } else {
          document.addEventListener(
            "DOMContentLoaded",
            () => {
              setTimeout(initEmailJS, isIOSSafari ? 1000 : 100);
            },
            { once: true },
          );
        }
      },
      // Window load with iOS-specific delay
      () => {
        console.log("Strategy 3: Window load");
        if (document.readyState === "complete") {
          setTimeout(initEmailJS, isIOSSafari ? 2000 : 500);
        } else {
          window.addEventListener(
            "load",
            () => {
              setTimeout(initEmailJS, isIOSSafari ? 2000 : 500);
            },
            { once: true },
          );
        }
      },
      // Long delay for iOS Safari
      () => {
        console.log("Strategy 4: Long delay");
        setTimeout(initEmailJS, isIOSSafari ? 5000 : 3000);
      },
      // User interaction trigger for iOS (helps with security restrictions)
      () => {
        if (isIOSSafari) {
          console.log("Strategy 5: iOS user interaction trigger setup");
          const handleFirstInteraction = () => {
            console.log(
              "First user interaction detected, initializing EmailJS",
            );
            setTimeout(initEmailJS, 100);
            document.removeEventListener("touchstart", handleFirstInteraction);
            document.removeEventListener("click", handleFirstInteraction);
          };

          document.addEventListener("touchstart", handleFirstInteraction, {
            once: true,
          });
          document.addEventListener("click", handleFirstInteraction, {
            once: true,
          });
        }
      },
    ];

    // Try all strategies with progressive delays
    strategies.forEach((strategy, index) => {
      const strategyDelay = isIOSSafari ? index * 1000 : index * 500;
      setTimeout(() => {
        if (!emailJSReady && !window._emailJSFailed) {
          strategy();
        }
      }, strategyDelay);
    });

    // Final fallback check after extended time
    setTimeout(
      () => {
        if (!emailJSReady && !window._emailJSFailed) {
          console.log("Final fallback check for EmailJS");
          initEmailJS();
        }
      },
      isIOSSafari ? 10000 : 6000,
    );

    return () => {
      if (initTimer) {
        clearTimeout(initTimer);
      }
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

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim().length === 0,
    );

    // Check if there are any validation errors for filled fields
    const validationErrors = Object.entries(formErrors).filter(
      ([field, error]) => {
        // Only count errors for fields that have content or are required
        if (
          field === "email" &&
          (!formData[field] || formData[field].trim() === "")
        ) {
          return false; // Skip empty optional email field
        }
        return error && error.trim().length > 0;
      },
    );

    const hasAllRequiredFields = missingFields.length === 0;
    const hasNoErrors = validationErrors.length === 0;

    // Enhanced debug logging for troubleshooting
    console.log("=== Form Ready Check ===", {
      hasAllRequiredFields,
      hasNoErrors,
      missingFields,
      validationErrors: validationErrors.map(([field, error]) => ({
        field,
        error,
      })),
      formData: Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value
            ? `${value.slice(0, 30)}${value.length > 30 ? "..." : ""}`
            : "EMPTY",
        ]),
      ),
      formErrors: Object.fromEntries(
        Object.entries(formErrors).map(([key, error]) => [
          key,
          error || "NO_ERROR",
        ]),
      ),
    });

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
      // Skip validation for empty optional fields (like email)
      if (fieldName === "email" && (!value || value.trim() === "")) {
        setFormErrors((prev) => {
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

  // Send email confirmation with enhanced iOS Safari support
  const sendEmailConfirmation = async () => {
    if (!formData.email) {
      console.log("Email not provided");
      return;
    }

    // Enhanced iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;

    // Wait for EmailJS with enhanced iOS Safari handling
    const waitForEmailJS = () => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = isIOSSafari ? 30 : 20; // More attempts for iOS Safari

        const checkEmailJS = () => {
          attempts++;
          console.log(
            `Checking EmailJS availability (attempt ${attempts}/${maxAttempts})`,
          );

          if (window.emailjs && window._emailJSReady) {
            console.log("EmailJS is ready and initialized");
            resolve(true);
          } else if (window._emailJSFailed) {
            console.error("EmailJS initialization failed");
            reject(new Error("EmailJS failed to initialize"));
          } else if (attempts >= maxAttempts) {
            console.error("EmailJS timeout after maximum attempts");
            reject(new Error("EmailJS timeout"));
          } else {
            // Progressive timeout increases for iOS Safari
            let timeout;
            if (isIOSSafari) {
              timeout = Math.min(1000 + attempts * 200, 3000);
            } else if (isSafari) {
              timeout = Math.min(500 + attempts * 100, 2000);
            } else {
              timeout = 500;
            }

            setTimeout(checkEmailJS, timeout);
          }
        };

        checkEmailJS();
      });
    };

    try {
      console.log("=== Enhanced EmailJS Debug Info ===");
      console.log("Browser:", navigator.userAgent);
      console.log("Is iOS Safari:", isIOSSafari);
      console.log("EmailJS Ready:", !!window._emailJSReady);
      console.log("Attempting to send email to:", formData.email);

      // Wait for EmailJS to be ready with timeout handling
      try {
        await waitForEmailJS();
      } catch (waitError) {
        console.error("EmailJS wait failed:", waitError);
        // For iOS Safari, try one more time with manual initialization
        if (isIOSSafari && window.emailjs) {
          try {
            console.log("iOS Safari: Attempting manual re-initialization");
            window.emailjs.init("xZ-FMAkzHPph3aojg");
            window._emailJSReady = true;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (reinitError) {
            console.error("Manual re-initialization failed:", reinitError);
            throw waitError;
          }
        } else {
          throw waitError;
        }
      }

      if (!window.emailjs) {
        throw new Error("EmailJS failed to load");
      }

      console.log("EmailJS is ready, preparing email data...");
      console.log("Cart items:", cartItems);
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
        order_total: totalAmount,
        order_notes: formData.notes.trim() || "No additional notes",
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        subtotal: `${subtotalAmount} EGP`,
        shipping: "80.00 EGP",
        total: `${totalAmount} EGP`,
      };

      console.log("=== Final Template Params ===");
      console.log(JSON.stringify(templateParams, null, 2));

      // iOS Safari specific: Add longer delay and additional safeguards
      if (isIOSSafari) {
        console.log("iOS Safari: Adding extended delay before sending");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Additional verification for iOS Safari
        if (!window.emailjs || !window._emailJSReady) {
          throw new Error("EmailJS not properly initialized for iOS Safari");
        }
      } else if (isSafari) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log("Sending email via EmailJS...");
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
      console.error("Browser info:", {
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        isIOS: isIOS,
        isSafari: isSafari,
        isIOSSafari: isIOSSafari,
        emailJSAvailable: !!window.emailjs,
        emailJSReady: !!window._emailJSReady,
        emailJSFailed: !!window._emailJSFailed,
      });

      // Enhanced retry logic for iOS Safari
      if ((isIOSSafari || isSafari) && !error.retried) {
        console.log(
          `${isIOSSafari ? "iOS Safari" : "Safari"} detected, attempting enhanced retry...`,
        );

        // Longer delay for iOS Safari
        const retryDelay = isIOSSafari ? 3000 : 2000;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        // Force re-initialization for iOS Safari if needed
        if (isIOSSafari && window.emailjs) {
          try {
            console.log("iOS Safari: Force re-initializing EmailJS for retry");
            window.emailjs.init("xZ-FMAkzHPph3aojg");
            window._emailJSReady = true;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (reinitError) {
            console.error("iOS Safari re-initialization failed:", reinitError);
          }
        }

        if (window.emailjs) {
          try {
            error.retried = true;
            console.log("Attempting retry with enhanced error handling");
            return await sendEmailConfirmation();
          } catch (retryError) {
            console.error(
              `${isIOSSafari ? "iOS Safari" : "Safari"} retry also failed:`,
              retryError,
            );

            // Final attempt for iOS Safari with different approach
            if (isIOSSafari && !retryError.finalAttempt) {
              console.log("iOS Safari: Final attempt with different timing");
              await new Promise((resolve) => setTimeout(resolve, 2000));

              try {
                retryError.finalAttempt = true;
                return await sendEmailConfirmation();
              } catch (finalError) {
                console.error("iOS Safari final attempt failed:", finalError);
              }
            }
          }
        }
      }

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

    // iOS Safari specific: Prevent default more aggressively
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;

    if (isIOSSafari) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    // Validate form
    if (!validateFormData()) {
      setSubmitError(
        "Please fill in all required fields correctly before placing your order.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // iOS Safari: Add extra delay for form processing
      if (isIOSSafari) {
        console.log("iOS Safari: Adding form processing delay");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

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

      // Simulate order processing with iOS-specific timing
      const processingDelay = isIOSSafari ? 2000 : 1500;
      await new Promise((resolve) => setTimeout(resolve, processingDelay));

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

      // Store order for confirmation page with iOS Safari safeguards
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

      // iOS Safari: Add delay before navigation
      if (isIOSSafari) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

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
                disabled={isSubmitting || !isFormReady()}
                className="w-full text-white py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 place-order-button button-loading"
                style={{
                  backgroundColor:
                    isSubmitting || !isFormReady() ? "#9ca3af" : "#002b5e",
                  minHeight: "48px",
                  fontSize: "16px",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && isFormReady()) {
                    e.target.style.backgroundColor = "#001a3d";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && isFormReady()) {
                    e.target.style.backgroundColor = "#002b5e";
                  }
                }}
                onTouchStart={(e) => {
                  // iOS Safari specific: Ensure touch events work properly
                  if (!isSubmitting && isFormReady()) {
                    e.target.style.backgroundColor = "#001a3d";
                  }
                }}
                onTouchEnd={(e) => {
                  // iOS Safari specific: Reset background after touch
                  if (!isSubmitting && isFormReady()) {
                    setTimeout(() => {
                      e.target.style.backgroundColor = "#002b5e";
                    }, 100);
                  }
                }}
                onClick={(e) => {
                  // Additional click handler for iOS Safari
                  console.log("Button clicked:", {
                    isSubmitting,
                    isFormReady: isFormReady(),
                    disabled: e.target.disabled,
                    buttonEnabled: !isSubmitting && isFormReady(),
                  });

                  // Prevent multiple clicks
                  if (isSubmitting || !isFormReady()) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                <span>
                  {isSubmitting ? "Processing Order..." : "Place Order"}
                </span>
              </button>

              {/* Enhanced form status indicator */}
              {!isFormReady() && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center font-medium">
                    Please complete all required fields to place your order
                  </p>
                  {Object.keys(formErrors).length > 0 && (
                    <div className="mt-2 text-xs text-yellow-700">
                      <p>Issues found:</p>
                      <ul className="list-disc list-inside">
                        {Object.entries(formErrors).map(
                          ([field, error]) =>
                            error && <li key={field}>{error}</li>,
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Debug section for development */}
                  {process.env.NODE_ENV === "development" && (
                    <details className="mt-2 text-xs text-gray-600">
                      <summary className="cursor-pointer text-gray-700 font-medium">
                        Debug Info
                      </summary>
                      <div className="mt-1 space-y-1">
                        <div>
                          Form Data: {JSON.stringify(formData, null, 2)}
                        </div>
                        <div>
                          Form Errors: {JSON.stringify(formErrors, null, 2)}
                        </div>
                        <div>Is Form Ready: {isFormReady().toString()}</div>
                      </div>
                    </details>
                  )}
                </div>
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
