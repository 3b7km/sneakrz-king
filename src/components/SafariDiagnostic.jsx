import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import {
  detectSafari,
  checkEmailJSCompatibility,
  diagnoseEmailJSIssues,
  getSavedErrors,
  clearSavedErrors
} from '../utils/safariDebugger';

const SafariDiagnostic = ({ isVisible = false }) => {
  const [diagnostics, setDiagnostics] = useState(null);
  const [savedErrors, setSavedErrors] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isVisible) {
      runDiagnostics();
      setSavedErrors(getSavedErrors());
    }
  }, [isVisible]);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await diagnoseEmailJSIssues();
      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearErrors = () => {
    clearSavedErrors();
    setSavedErrors([]);
  };

  if (!isVisible) return null;

  const renderStatusIcon = (isSuccess) => {
    if (isSuccess) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Safari/iOS Diagnostics
        </h3>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isRunning ? (
        <div className="text-center py-4">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
          <p className="text-sm text-gray-600 mt-2">Running diagnostics...</p>
        </div>
      ) : diagnostics ? (
        <div className="space-y-3">
          {/* Safari Detection */}
          <div className="border-b pb-2">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Browser Detection</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>Safari:</span>
                {renderStatusIcon(diagnostics.safariInfo.isSafari)}
              </div>
              <div className="flex items-center justify-between">
                <span>iOS:</span>
                {renderStatusIcon(diagnostics.safariInfo.isIOS)}
              </div>
              <div className="flex items-center justify-between">
                <span>iOS Safari:</span>
                {renderStatusIcon(diagnostics.safariInfo.isIOSSafari)}
              </div>
            </div>
          </div>

          {/* EmailJS Compatibility */}
          <div className="border-b pb-2">
            <h4 className="font-medium text-sm text-gray-700 mb-2">EmailJS Status</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>EmailJS Loaded:</span>
                {renderStatusIcon(diagnostics.compatibility.emailJSLoaded)}
              </div>
              <div className="flex items-center justify-between">
                <span>EmailJS Ready:</span>
                {renderStatusIcon(diagnostics.compatibility.emailJSReady)}
              </div>
              <div className="flex items-center justify-between">
                <span>Network Online:</span>
                {renderStatusIcon(diagnostics.compatibility.networkOnline)}
              </div>
              <div className="flex items-center justify-between">
                <span>Cookies Enabled:</span>
                {renderStatusIcon(diagnostics.compatibility.cookiesEnabled)}
              </div>
              <div className="flex items-center justify-between">
                <span>LocalStorage:</span>
                {renderStatusIcon(diagnostics.compatibility.localStorageAvailable)}
              </div>
            </div>
          </div>

          {/* Network Test */}
          {diagnostics.networkTest && (
            <div className="border-b pb-2">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Network Test</h4>
              <div className="flex items-center justify-between text-xs">
                <span>External Request:</span>
                {renderStatusIcon(diagnostics.networkTest.success)}
              </div>
              {!diagnostics.networkTest.success && (
                <p className="text-xs text-red-600 mt-1">
                  Network error: {diagnostics.networkTest.error}
                </p>
              )}
            </div>
          )}

          {/* Service Test */}
          {diagnostics.serviceTest && (
            <div className="border-b pb-2">
              <h4 className="font-medium text-sm text-gray-700 mb-2">EmailJS Service</h4>
              <div className="flex items-center justify-between text-xs">
                <span>Service Available:</span>
                {renderStatusIcon(diagnostics.serviceTest.emailJSAvailable)}
              </div>
              {!diagnostics.serviceTest.emailJSAvailable && (
                <p className="text-xs text-red-600 mt-1">
                  {diagnostics.serviceTest.reason || diagnostics.serviceTest.error}
                </p>
              )}
            </div>
          )}

          {/* Saved Errors */}
          {savedErrors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-700">Recent Errors ({savedErrors.length})</h4>
                <button
                  onClick={handleClearErrors}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {savedErrors.slice(-3).map((error, index) => (
                  <div key={index} className="text-xs bg-red-50 p-2 rounded">
                    <div className="font-medium text-red-800">{error.error.name}</div>
                    <div className="text-red-600 truncate">{error.error.message}</div>
                    <div className="text-red-500 text-xs">{new Date(error.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600">Click refresh to run diagnostics</p>
      )}
    </div>
  );
};

export default SafariDiagnostic;
