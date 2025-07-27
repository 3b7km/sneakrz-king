import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { LoadingSpinner } from "../LoadingSpinner";
import { AlertCircle, CheckCircle } from "lucide-react";

// Utility function for admins to check failed notifications
// Run this in browser console: window.checkFailedNotifications()
window.checkFailedNotifications = () => {
  try {
    const failed = JSON.parse(localStorage.getItem('failedAdminNotifications') || '[]');
    console.log(`📊 Found ${failed.length} failed admin notifications:`);
    failed.forEach((notification, index) => {
      console.group(`Order ${index + 1} - ${notification.timestamp}`);
      console.log('Customer:', `${notification.customerInfo.firstName} ${notification.customerInfo.lastName}`);
      console.log('Email:', notification.customerInfo.email || 'Not provided');
      console.log('Phone:', notification.customerInfo.phone);
      console.log('Address:', `${notification.customerInfo.address}, ${notification.customerInfo.city}`);
      console.log('Total:', `${notification.total} EGP`);
      console.log('Items:', notification.orderItems.length);
      console.log('Error:', notification.error);
      console.groupEnd();
    });
    return failed;
  } catch (error) {
    console.error('Error checking failed notifications:', error);
    return [];
  }
};

// Utility to clear processed notifications
window.clearFailedNotifications = () => {
  localStorage.removeItem('failedAdminNotifications');
  console.log('✅ Failed notifications cleared');
};


import {
  validateForm,
  validateField,
  checkoutValidationRules,
} from "../../utils/formValidation";
import {
  detectSafari,
  checkEmailJSCompatibility,
  logOrderError,
  diagnoseEmailJSIssues,
} from "../../utils/safariDebugger";
import createSafariErrorRecovery from "../../utils/safariErrorRecovery";

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, getAF1Discount, getDiscountedPrice, isAF1Product, getShippingCost, isFreeShipping, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    instagram: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState(null);


  // Calculate totals with AF1 discounts
  const subtotal = getTotalPrice();
  const af1Discount = getAF1Discount();
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  // Initialize EmailJS with enhanced error handling
  useEffect(() => {
    // Log Safari/iOS compatibility info
    const safariInfo = detectSafari();
    console.log('🍎 Safari/iOS Detection:', safariInfo);

    if (safariInfo.isIOSSafari) {
      console.log('📱 Running on iOS Safari - Enhanced compatibility mode enabled');


    }

    let retryCount = 0;
    const maxRetries = 15;
    let emailJSReady = false;

    const initEmailJS = () => {
      console.log(`EmailJS init attempt ${retryCount + 1}/${maxRetries}`);

      // Enhanced browser detection for better debugging
      const userAgent = navigator.userAgent;
      const isBrave = navigator.brave;
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

      // Check if EmailJS script is loaded
      if (typeof window.emailjs === 'undefined') {
        console.log("EmailJS script not loaded yet, checking CDN...");

        // Browser-specific debugging
        if (isBrave) {
          console.warn("🦁 Brave browser detected: EmailJS CDN may be blocked by Brave Shields");
          console.warn("💡 Try: Settings > Shields > Down for this site, or allow Scripts & Plugins");
        } else if (isSafari) {
          console.warn("🍎 Safari detected: EmailJS CDN may be blocked by tracking prevention");
          console.warn("💡 Try: Safari Settings > Privacy > Disable 'Prevent cross-site tracking' for this site");
        }

        retryCount++;
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * retryCount, 5000); // Cap at 5 seconds
          console.log(`Retrying EmailJS init in ${delay}ms`);
          setTimeout(initEmailJS, delay);
        } else {
          console.error("EmailJS CDN failed to load after maximum retries");
          console.error("This may be due to network restrictions, ad blockers, or browser privacy settings");

          // Browser-specific failure messages
          if (isBrave) {
            console.error("🦁 Brave users: Disable Shields or allow third-party scripts for email to work");
          } else if (isSafari) {
            console.error("🍎 Safari users: Check privacy settings and allow cross-site requests");
          }

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



  // Enhanced validation using utility functions
  const validateFormData = () => {
    const formDataForValidation = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      streetAddress: formData.address,
      city: formData.city,
      instagram: formData.instagram,
    };

    const customValidationRules = {
      firstName: checkoutValidationRules.firstName,
      lastName: checkoutValidationRules.lastName,
      email: checkoutValidationRules.email,
      phone: checkoutValidationRules.phone,
      streetAddress: checkoutValidationRules.streetAddress,
      city: checkoutValidationRules.city,
      instagram: checkoutValidationRules.instagram,
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
    if (validation.errors.instagram) mappedErrors.instagram = validation.errors.instagram;

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
    // Only check for required fields and relevant errors
    const hasRequiredFields =
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim();

    // Filter out email errors if email is empty (since it's optional)
    const relevantErrors = Object.keys(errors).filter(field => {
      if (field === 'email' && (!formData.email || formData.email.trim() === '')) {
        return false; // Ignore email errors if no email provided
      }
      return true;
    });

    return hasRequiredFields && relevantErrors.length === 0;
  };

  // Send admin notification email (always sent)
  const sendAdminNotification = async () => {
    console.log("📧 Sending admin notification for new order...");

    const safariInfo = detectSafari();
    const safariRecovery = createSafariErrorRecovery();

    try {
      // Enhanced EmailJS readiness check
      if (safariInfo.isIOSSafari) {
        await safariRecovery.safariEmailJSInit("xZ-FMAkzHPph3aojg", 15000);
      } else {
        const waitForEmailJS = () => {
          return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30;

            const checkEmailJS = () => {
              attempts++;
              if (window.emailjs && window._emailJSReady) {
                resolve(true);
              } else if (window._emailJSFailed) {
                reject(new Error("EmailJS failed to initialize"));
              } else if (attempts >= maxAttempts) {
                reject(new Error("EmailJS timeout"));
              } else {
                setTimeout(checkEmailJS, 750);
              }
            };
            checkEmailJS();
          });
        };
        await waitForEmailJS();
      }

      if (!window.emailjs || typeof window.emailjs.send !== 'function') {
        throw new Error("EmailJS not available");
      }

      const calculatedSubtotal = cartItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 1;
        return sum + itemPrice * itemQuantity;
      }, 0);

      const customerName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const orderItemsList = cartItems.length > 0
        ? cartItems
            .map((item) => {
              const itemPrice = parseFloat(item.price) || 0;
              const itemQuantity = parseInt(item.quantity) || 1;
              const itemTotal = itemPrice * itemQuantity;
              return `• ${item.name || "Unknown Item"} - Size: ${item.selectedSize || "N/A"} - Qty: ${itemQuantity} - Price: ${itemTotal.toFixed(2)} EGP`;
            })
            .join("\n")
        : "No items in cart";

      // Admin notification template parameters
      const adminTemplateParams = {
        admin_subject: `🆕 New Order from ${customerName}`,
        customer_name: customerName,
        customer_email: formData.email.trim() || "Not provided",
        customer_phone: formData.phone.trim() || "Not provided",
        customer_address: `${formData.address.trim()}, ${formData.city.trim()}`,
        order_items: orderItemsList,
        subtotal_amount: calculatedSubtotal.toFixed(2),
        shipping_amount: shipping.toFixed(2),
        total_amount: total.toFixed(2),
        order_notes: formData.notes.trim() || "No additional notes",
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        has_customer_email: formData.email ? "Yes" : "No",
        notification_type: "admin_new_order"
      };

      console.log("📧 Sending admin notification...");

      let response;
      if (safariInfo.isIOSSafari) {
        response = await safariRecovery.safariEmailJSSend(
          "service_jpicl4m",
          "template_sd6o0td", // Use same template but with admin-specific parameters
          adminTemplateParams,
          "xZ-FMAkzHPph3aojg"
        );
      } else {
        response = await window.emailjs.send(
          "service_jpicl4m",
          "template_sd6o0td", // Use same template but with admin-specific parameters
          adminTemplateParams,
          "xZ-FMAkzHPph3aojg"
        );
      }

      console.log("��� Admin notification sent successfully!");
      return response;

    } catch (error) {
      console.error("❌ Admin notification failed:", error);
      return null;
    }
  };

  // Send customer email confirmation (only if email provided)
  const sendCustomerConfirmation = async () => {
    if (!formData.email) {
      console.log("📧 Customer email not provided, skipping customer confirmation");
      return null;
    }

    console.log("🚀 Starting customer email confirmation process...");
    console.log("📧 Recipient email:", formData.email);

    const safariInfo = detectSafari();
    const safariRecovery = createSafariErrorRecovery();

    try {
      // Use Safari-specific EmailJS initialization if on Safari/iOS
      if (safariInfo.isIOSSafari) {
        console.log("🍎 Using Safari-specific EmailJS handling");
        await safariRecovery.safariEmailJSInit("xZ-FMAkzHPph3aojg", 15000);
      } else {
        // Enhanced EmailJS readiness check for other browsers
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
      }

      // Additional safety checks with browser-specific messages
      if (!window.emailjs) {
        const userAgent = navigator.userAgent;
        const isBrave = navigator.brave;
        const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

        let errorMsg = "EmailJS object not found - CDN may be blocked";
        if (isBrave) {
          errorMsg += ". In Brave browser, try disabling Shields for this site or allowing third-party scripts.";
        } else if (isSafari) {
          errorMsg += ". In Safari, check privacy settings and allow cross-site tracking for this site.";
        }

        throw new Error(errorMsg);
      }

      if (typeof window.emailjs.send !== 'function') {
        throw new Error("EmailJS send function not available - service may be blocked by browser security settings");
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
        shipping_amount: shipping.toFixed(2),
        total_amount: total.toFixed(2),
        order_total: total.toFixed(2),
        order_notes: formData.notes.trim() || "No additional notes",
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        subtotal: `${calculatedSubtotal.toFixed(2)} EGP`,
        shipping: `${shipping.toFixed(2)} EGP`,
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

      // Use Safari-specific sending or standard method
      try {
        console.log("🔍 Testing EmailJS service availability...");

        let response;
        if (safariInfo.isIOSSafari) {
          console.log("🍎 Using Safari-specific email sending");
          response = await safariRecovery.safariEmailJSSend(
            "service_jpicl4m",
            "template_sd6o0td",
            templateParams,
            "xZ-FMAkzHPph3aojg"
          );
        } else {
          response = await window.emailjs.send(
            "service_jpicl4m",
            "template_sd6o0td",
            templateParams,
            "xZ-FMAkzHPph3aojg" // Public key as 4th parameter for better compatibility
          );
        }

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
      setEmailSentStatus("sending");

      // Always send admin notification
      console.log("📧 Sending admin notification...");
      let adminResult = null;
      try {
        adminResult = await sendAdminNotification();
        console.log("✅ Admin notification result:", adminResult ? "success" : "failed");
      } catch (adminError) {
        console.error("❌ Admin notification failed:", adminError);

        // Fallback: Store order info for manual retrieval
        try {
          const failedNotification = {
            timestamp: new Date().toISOString(),
            customerInfo: formData,
            orderItems: cartItems,
            total: total,
            error: adminError.message,
            userAgent: navigator.userAgent.substring(0, 100)
          };

          // Store in localStorage as backup
          const existingFailedOrders = JSON.parse(localStorage.getItem('failedAdminNotifications') || '[]');
          existingFailedOrders.push(failedNotification);

          // Keep only last 50 failed notifications to avoid storage overflow
          if (existingFailedOrders.length > 50) {
            existingFailedOrders.splice(0, existingFailedOrders.length - 50);
          }

          localStorage.setItem('failedAdminNotifications', JSON.stringify(existingFailedOrders));
          console.log("📦 Order details stored locally as backup for admin review");
        } catch (storageError) {
          console.error("❌ Could not store backup notification:", storageError);
        }
      }

      // Send customer confirmation only if email is provided
      let customerResult = null;
      if (formData.email) {
        console.log("📧 Sending customer confirmation...");
        try {
          customerResult = await sendCustomerConfirmation();
          console.log("✅ Customer confirmation result:", customerResult ? "success" : "failed");
        } catch (emailError) {
          console.error("Email confirmation error:", emailError);

          // Enhanced browser-specific error logging
          const userAgent = navigator.userAgent;
          const isBrave = navigator.brave; // Check if brave object exists
          const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

          console.group("🚨 Email Error Analysis");
          console.error("Error details:", {
            name: emailError.name,
            message: emailError.message,
            status: emailError.status,
            stack: emailError.stack?.substring(0, 200) + '...'
          });

          console.log("Browser context:", {
            isBrave: !!isBrave,
            isSafari,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            emailJSAvailable: !!window.emailjs,
            emailJSReady: !!window._emailJSReady,
            emailJSFailed: !!window._emailJSFailed
          });

          // Browser-specific debugging advice
          if (isBrave) {
            console.warn("🦁 Brave detected: Email may fail due to:");
            console.warn("- Brave Shields blocking third-party scripts");
            console.warn("- Privacy settings blocking trackers");
            console.warn("- Ad/tracker blocking affecting EmailJS CDN");
          }

          if (isSafari) {
            console.warn("🍎 Safari detected: Email may fail due to:");
            console.warn("- Intelligent Tracking Prevention (ITP)");
            console.warn("- Cross-site tracking prevention");
            console.warn("- Third-party cookie blocking");
            console.warn("- Safari's strict security policies");
          }
          console.groupEnd();

          // Enhanced error logging
          logOrderError(emailError, {
            checkoutStep: 'email_confirmation',
            emailJSCompatibility: checkEmailJSCompatibility(),
            browserInfo: {
              isBrave: !!isBrave,
              isSafari,
              userAgent: userAgent.substring(0, 100)
            },
            formData: {
              hasEmail: !!formData.email,
              emailValue: formData.email ? 'provided' : 'not_provided'
            }
          });

          // Customer email failed but continue
        }
      }

      // Set overall email status
      if (adminResult && customerResult) {
        setEmailSentStatus("sent"); // Both succeeded
        console.log("✅ All notifications sent successfully");
      } else if (adminResult && !formData.email) {
        setEmailSentStatus("sent"); // Admin sent, no customer email needed
        console.log("✅ Admin notified, customer email not provided");
      } else if (adminResult && formData.email && !customerResult) {
        setEmailSentStatus("partial"); // Admin sent, customer failed
        console.log("⚠️ Admin notified, customer email failed");
      } else if (!adminResult && customerResult) {
        setEmailSentStatus("partial"); // Customer sent, admin failed
        console.log("⚠️ Customer notified, admin notification failed");
        console.error("🚨 IMPORTANT: Admin was not notified of this order! Check localStorage for backup order details.");
      } else {
        setEmailSentStatus("failed"); // Both failed
        console.error("🚨 CRITICAL: All email notifications failed!");
        console.error("📋 Check localStorage 'failedAdminNotifications' for order backup");
        console.error("🔧 Admin troubleshooting steps:");
        console.error("1. Check EmailJS service status and configuration");
        console.error("2. Verify internet connection and browser settings");
        console.error("3. Check for ad blockers or privacy settings blocking EmailJS");
        console.error("4. Consider implementing alternative notification methods");
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

      // Enhanced error logging for Safari/iOS debugging
      const errorDetails = logOrderError(error, {
        formData: {
          hasEmail: !!formData.email,
          hasPhone: !!formData.phone,
          hasName: !!(formData.firstName && formData.lastName)
        },
        cartInfo: {
          itemCount: cartItems.length,
          totalPrice: total
        },
        checkoutStep: 'order_submission'
      });

      // Provide more specific error messages for Safari/iOS users
      const safariInfo = detectSafari();
      let errorMessage = "Order submission failed. Please check your information and try again.";

      if (safariInfo.isIOSSafari) {
        errorMessage += " If you're using iOS Safari, please ensure you have a stable internet connection and try again.";
      }

      setSubmitError(errorMessage);
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
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800">Error</h4>
                    <p className="text-red-700">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {emailSentStatus === "failed" && formData.email && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">Email Confirmation Failed</h4>
                    <p className="text-yellow-700 mb-2">
                      We couldn't send the confirmation email, but your order will still be processed.
                    </p>
                    <details className="text-sm text-yellow-700">
                      <summary className="cursor-pointer font-medium">Why might this happen?</summary>
                      <div className="mt-2 space-y-1">
                        <p>• <strong>Safari users:</strong> Check Privacy settings and allow cross-site tracking for this site</p>
                        <p>• <strong>Brave users:</strong> Try disabling Shields or allowing scripts for this site</p>
                        <p>• <strong>Ad blockers:</strong> Email service may be blocked by ad/privacy blockers</p>
                        <p>• <strong>Network issues:</strong> Temporary connectivity problems</p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {emailSentStatus === "sent" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">Notifications Sent Successfully</h4>
                    <p className="text-green-700">
                      ✅ Store owner has been notified of your order
                      {formData.email && (
                        <>
                          <br />✅ Order confirmation has been sent to {formData.email}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {emailSentStatus === "partial" && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800">Order Received</h4>
                    <p className="text-blue-700">
                      ✅ Store owner has been notified of your order
                      {formData.email && (
                        <>
                          <br />⚠️ Customer confirmation email had issues, but your order is confirmed
                        </>
                      )}
                    </p>
                  </div>
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
                  <div className="text-right">
                    {isAF1Product(item.id) ? (
                      <>
                        <p className="font-medium text-pink-600">
                          {getDiscountedPrice(item) * item.quantity} EGP
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {item.price * item.quantity} EGP
                        </p>
                      </>
                    ) : (
                      <p className="font-medium">
                        {item.price * item.quantity} EGP
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              {af1Discount > 0 && (
                <div className="flex justify-between text-pink-600">
                  <span>AF1 Special Offer</span>
                  <span>-{af1Discount} EGP</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={isFreeShipping() ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : `${shipping} EGP`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>{total} EGP</span>
              </div>
              {af1Discount > 0 && (
                <p className="text-sm text-pink-600 text-center">
                  You saved {af1Discount} EGP on AF1 shoes!
                </p>
              )}
              {isFreeShipping() && (
                <p className="text-sm text-green-600 text-center font-medium">
                  🚚 FREE Shipping Applied!
                </p>
              )}
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
