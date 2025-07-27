import { useState, useEffect } from 'react';
import { AlertTriangle, X, Settings } from 'lucide-react';
import { detectSafari, getSavedErrors } from '../utils/safariDebugger';

const SafariNotificationBanner = ({ onOpenDiagnostic }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [safariInfo, setSafariInfo] = useState(null);
  const [hasEmailErrors, setHasEmailErrors] = useState(false);

  useEffect(() => {
    const detectedSafariInfo = detectSafari();
    setSafariInfo(detectedSafariInfo);

    const dismissed = localStorage.getItem('safari_banner_dismissed');

    console.log('Safari detection:', detectedSafariInfo);

    // Show banner for Safari/iOS users who haven't dismissed it, or if there are saved email errors
    const savedErrors = getSavedErrors();
    const emailErrors = savedErrors.length > 0;
    setHasEmailErrors(emailErrors);

    const shouldShow = (detectedSafariInfo.isIOSSafari || detectedSafariInfo.isSafari || emailErrors) && !dismissed;

    if (shouldShow) {
      setIsVisible(true);
      console.log('Safari banner will be shown');
    } else {
      console.log('Safari banner hidden - dismissed:', !!dismissed, 'safari detected:', detectedSafariInfo.isSafari);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('safari_banner_dismissed', 'true');
  };

  const handleOpenDiagnostic = () => {
    if (onOpenDiagnostic) {
      onOpenDiagnostic();
    }
    handleDismiss();
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium">
              {safariInfo.isIOSSafari || safariInfo.isSafari
                ? "Safari/iOS User? We've enhanced ordering compatibility for you!"
                : hasEmailErrors
                  ? "Email Issues Detected - Diagnostic Tools Available"
                  : "Enhanced Email Compatibility Available"}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {hasEmailErrors
                ? "Previous email sending issues detected. Use diagnostic tools for troubleshooting."
                : "If you experience any issues during checkout, our diagnostic tools can help."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenDiagnostic}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-3 h-3" />
            Diagnostic
          </button>
          <button
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800 p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafariNotificationBanner;
