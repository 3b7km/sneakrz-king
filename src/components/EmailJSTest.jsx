import { useState, useEffect } from "react";

const EmailJSTest = () => {
  const [emailJSStatus, setEmailJSStatus] = useState("checking");
  const [testResult, setTestResult] = useState(null);
  const [browserInfo, setBrowserInfo] = useState({});

  useEffect(() => {
    // Get browser information
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;

    setBrowserInfo({
      userAgent: navigator.userAgent,
      isSafari,
      isIOS,
      isIOSSafari,
      vendor: navigator.vendor,
    });

    // Check EmailJS availability
    const checkEmailJS = () => {
      let attempts = 0;
      const maxAttempts = 20;

      const check = () => {
        attempts++;
        console.log(`EmailJS Check Attempt ${attempts}/${maxAttempts}`);

        if (window.emailjs) {
          console.log("EmailJS found!", window.emailjs);
          setEmailJSStatus("found");

          // Try to initialize
          try {
            window.emailjs.init("xZ-FMAkzHPph3aojg");
            console.log("EmailJS initialized successfully");
            setEmailJSStatus("initialized");
            return true;
          } catch (error) {
            console.error("EmailJS initialization failed:", error);
            setEmailJSStatus("init-failed");
            return false;
          }
        } else if (attempts >= maxAttempts) {
          console.error("EmailJS not found after maximum attempts");
          setEmailJSStatus("not-found");
          return false;
        } else {
          console.log(`EmailJS not found, retrying in ${500 * attempts}ms...`);
          setTimeout(check, 500 * attempts);
        }
      };

      check();
    };

    // Start checking with different strategies
    checkEmailJS();

    // Also try after DOM is fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkEmailJS);
    }

    // And after window load
    window.addEventListener("load", checkEmailJS);

    return () => {
      document.removeEventListener("DOMContentLoaded", checkEmailJS);
      window.removeEventListener("load", checkEmailJS);
    };
  }, []);

  const testEmailJS = async () => {
    if (!window.emailjs) {
      setTestResult("EmailJS not available");
      return;
    }

    setTestResult("testing");

    try {
      // Test email parameters
      const testParams = {
        customer_name: "Test User",
        customer_email: "test@example.com",
        customer_phone: "01234567890",
        customer_address: "Test Address, Test City",
        order_items: "Test Item - Size: 42 - Qty: 1 - Price: 100.00 EGP",
        subtotal_amount: "100.00",
        shipping_amount: "80.00",
        total_amount: "180.00",
        order_total: "180.00",
        order_notes: "Test order",
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        subtotal: "100.00 EGP",
        shipping: "80.00 EGP",
        total: "180.00 EGP",
      };

      console.log("Sending test email with params:", testParams);

      const response = await window.emailjs.send(
        "service_jpicl4m",
        "template_sd6o0td",
        testParams,
      );

      console.log("Test email sent successfully:", response);
      setTestResult("success");
    } catch (error) {
      console.error("Test email failed:", error);
      setTestResult(`failed: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "checking":
        return "text-yellow-600";
      case "found":
        return "text-blue-600";
      case "initialized":
        return "text-green-600";
      case "init-failed":
      case "not-found":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">
        EmailJS Safari Integration Test
      </h2>

      {/* Browser Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Browser Information:</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>Safari:</strong> {browserInfo.isSafari ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>iOS:</strong> {browserInfo.isIOS ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>iOS Safari:</strong>{" "}
            {browserInfo.isIOSSafari ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>Vendor:</strong> {browserInfo.vendor}
          </p>
          <p>
            <strong>User Agent:</strong>{" "}
            <span className="break-all">{browserInfo.userAgent}</span>
          </p>
        </div>
      </div>

      {/* EmailJS Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">EmailJS Status:</h3>
        <p className={`text-lg font-medium ${getStatusColor(emailJSStatus)}`}>
          {emailJSStatus === "checking" && "🔍 Checking for EmailJS..."}
          {emailJSStatus === "found" && "📧 EmailJS Found"}
          {emailJSStatus === "initialized" &&
            "✅ EmailJS Initialized Successfully"}
          {emailJSStatus === "init-failed" &&
            "❌ EmailJS Initialization Failed"}
          {emailJSStatus === "not-found" && "❌ EmailJS Not Found"}
        </p>

        {window.emailjs && (
          <div className="mt-2 text-sm text-gray-600">
            <p>EmailJS Object Available: ✅</p>
            <p>Methods: {Object.keys(window.emailjs).join(", ")}</p>
          </div>
        )}
      </div>

      {/* Test Email Button */}
      {emailJSStatus === "initialized" && (
        <div className="mb-6">
          <button
            onClick={testEmailJS}
            disabled={testResult === "testing"}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testResult === "testing"
              ? "Sending Test Email..."
              : "Send Test Email"}
          </button>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div
          className={`p-4 rounded-lg ${
            testResult === "success"
              ? "bg-green-50 text-green-800"
              : testResult === "testing"
                ? "bg-yellow-50 text-yellow-800"
                : "bg-red-50 text-red-800"
          }`}
        >
          <h3 className="font-semibold mb-1">Test Result:</h3>
          <p>{testResult}</p>
        </div>
      )}

      {/* Console Logs */}
      <div className="mt-6 text-sm text-gray-500">
        <p>💡 Check your browser's console for detailed logs</p>
        <p>📧 If test email succeeds, check the configured email address</p>
      </div>
    </div>
  );
};

export default EmailJSTest;
