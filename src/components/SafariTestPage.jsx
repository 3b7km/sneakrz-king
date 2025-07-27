import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  detectSafari, 
  checkEmailJSCompatibility, 
  diagnoseEmailJSIssues,
  getSavedErrors,
  clearSavedErrors 
} from '../utils/safariDebugger';
import createSafariErrorRecovery from '../utils/safariErrorRecovery';
import SafariDiagnostic from './SafariDiagnostic';
import { AlertTriangle, TestTube, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const SafariTestPage = () => {
  const { addToCart, cartItems, clearCart } = useCart();
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [simulateSafari, setSimulateSafari] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(true);

  // Mock product for testing
  const testProduct = {
    id: 1,
    name: "Test Sneaker",
    price: 1500,
    image: "/api/placeholder/300/300",
    brand: "Test Brand"
  };

  const safariRecovery = createSafariErrorRecovery();

  useEffect(() => {
    // Simulate Safari environment if enabled
    if (simulateSafari) {
      window._simulatedSafari = true;
      window._simulatedIOSSafari = true;
    } else {
      delete window._simulatedSafari;
      delete window._simulatedIOSSafari;
    }
  }, [simulateSafari]);

  const runTest = async (testName, testFunction) => {
    console.log(`🧪 Running test: ${testName}`);
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'running', result: null, error: null }
    }));

    try {
      const result = await testFunction();
      console.log(`✅ Test passed: ${testName}`, result);
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'passed', result, error: null }
      }));
      return true;
    } catch (error) {
      console.error(`❌ Test failed: ${testName}`, error);
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'failed', result: null, error: error.message }
      }));
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    const tests = [
      {
        name: 'Safari Detection',
        test: async () => {
          const detection = detectSafari();
          if (simulateSafari) {
            return { ...detection, simulated: true };
          }
          return detection;
        }
      },
      {
        name: 'EmailJS Compatibility',
        test: async () => {
          return checkEmailJSCompatibility();
        }
      },
      {
        name: 'LocalStorage Test',
        test: async () => {
          const testKey = 'safari_test_' + Date.now();
          const testValue = { test: true, timestamp: Date.now() };
          
          const setResult = safariRecovery.safeLocalStorageSet(testKey, testValue);
          const getValue = safariRecovery.safeLocalStorageGet(testKey);
          
          // Cleanup
          try {
            localStorage.removeItem(testKey);
          } catch (e) {
            // Ignore cleanup errors
          }

          return {
            setSuccess: setResult,
            getValue: getValue,
            dataMatches: JSON.stringify(getValue) === JSON.stringify(testValue)
          };
        }
      },
      {
        name: 'Cart Operations',
        test: async () => {
          const initialCount = cartItems.length;
          addToCart(testProduct, 1, '42');
          
          // Wait a bit for state update
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const afterAdd = cartItems.length;
          const hasTestItem = cartItems.some(item => 
            item.id === testProduct.id && item.selectedSize === '42'
          );

          return {
            initialCount,
            afterAdd,
            hasTestItem,
            cartOperationSuccessful: hasTestItem
          };
        }
      },
      {
        name: 'EmailJS Diagnostic',
        test: async () => {
          return await diagnoseEmailJSIssues();
        }
      },
      {
        name: 'Form Submission Simulation',
        test: async () => {
          const mockFormSubmit = async () => {
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simulate potential Safari issues
            if (simulateSafari && Math.random() < 0.3) {
              throw new Error('Simulated Safari network timeout');
            }
            
            return { success: true, timestamp: Date.now() };
          };

          return await safariRecovery.safariFormSubmit(mockFormSubmit, 2);
        }
      }
    ];

    let passedTests = 0;
    for (const { name, test } of tests) {
      const passed = await runTest(name, test);
      if (passed) passedTests++;
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsRunningTests(false);
    console.log(`🏁 Test suite completed: ${passedTests}/${tests.length} tests passed`);
  };

  const renderTestResult = (testName, result) => {
    if (!result) return null;

    const getStatusIcon = () => {
      switch (result.status) {
        case 'running':
          return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
        case 'passed':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'failed':
          return <XCircle className="w-4 h-4 text-red-500" />;
        default:
          return null;
      }
    };

    const getStatusColor = () => {
      switch (result.status) {
        case 'running':
          return 'border-blue-200 bg-blue-50';
        case 'passed':
          return 'border-green-200 bg-green-50';
        case 'failed':
          return 'border-red-200 bg-red-50';
        default:
          return 'border-gray-200 bg-gray-50';
      }
    };

    return (
      <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{testName}</h4>
          {getStatusIcon()}
        </div>
        
        {result.error && (
          <p className="text-sm text-red-600 mb-2">{result.error}</p>
        )}
        
        {result.result && (
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
            {JSON.stringify(result.result, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  const clearTestCart = () => {
    clearCart();
  };

  const clearErrors = () => {
    clearSavedErrors();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TestTube className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Safari/iOS Testing Suite</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Test Controls</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={simulateSafari}
                    onChange={(e) => setSimulateSafari(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Simulate Safari Environment</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showDiagnostic}
                    onChange={(e) => setShowDiagnostic(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show Diagnostic Panel</span>
                </label>
              </div>

              <div className="space-y-2">
                <button
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={clearTestCart}
                    className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={clearErrors}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Clear Errors
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Current Status</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cart Items:</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Safari Simulation:</span>
                  <span className={`font-medium ${simulateSafari ? 'text-green-600' : 'text-gray-600'}`}>
                    {simulateSafari ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>EmailJS Status:</span>
                  <span className={`font-medium ${window.emailjs ? 'text-green-600' : 'text-red-600'}`}>
                    {window.emailjs ? 'Loaded' : 'Not Loaded'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saved Errors:</span>
                  <span className="font-medium">{getSavedErrors().length}</span>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Test Results</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName}>
                    {renderTestResult(testName, result)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Safari Diagnostic Panel */}
        <SafariDiagnostic isVisible={showDiagnostic} />
      </div>
    </div>
  );
};

export default SafariTestPage;
