// Safari/iOS detection and debugging utilities

/**
 * Detect Safari browser and iOS devices
 * @returns {Object} Detection results
 */
export const detectSafari = () => {
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;
  
  // Detect Safari browser
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent) && /apple/i.test(vendor);
  
  // Detect iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Detect iOS Safari specifically
  const isIOSSafari = isIOS && isSafari;
  
  // Detect mobile Safari
  const isMobileSafari = /iPhone|iPad|iPod/.test(userAgent) && isSafari;
  
  // Get iOS version if available
  const iosVersion = isIOS ? 
    (userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/) || [])[1] : null;
  
  return {
    isSafari,
    isIOS,
    isIOSSafari,
    isMobileSafari,
    iosVersion,
    userAgent,
    vendor,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints
  };
};

/**
 * Check EmailJS compatibility with current browser/device
 * @returns {Object} Compatibility information
 */
export const checkEmailJSCompatibility = () => {
  const safariInfo = detectSafari();
  
  const compatibility = {
    emailJSAvailable: !!window.emailjs,
    emailJSReady: !!window._emailJSReady,
    emailJSFailed: !!window._emailJSFailed,
    cookiesEnabled: navigator.cookieEnabled,
    onlineStatus: navigator.onLine,
    protocol: window.location.protocol,
    isSecure: window.location.protocol === 'https:',
    safariInfo
  };
  
  // Check for potential blockers
  const potentialIssues = [];
  
  if (!compatibility.cookiesEnabled) {
    potentialIssues.push('Cookies disabled');
  }
  
  if (!compatibility.onlineStatus) {
    potentialIssues.push('Device appears offline');
  }
  
  if (compatibility.protocol === 'file:') {
    potentialIssues.push('Using file:// protocol');
  }
  
  if (safariInfo.isIOSSafari && !compatibility.isSecure) {
    potentialIssues.push('iOS Safari prefers HTTPS');
  }
  
  if (!compatibility.emailJSAvailable && !compatibility.emailJSFailed) {
    potentialIssues.push('EmailJS script not loaded');
  }
  
  compatibility.potentialIssues = potentialIssues;
  compatibility.riskLevel = potentialIssues.length === 0 ? 'low' : 
    potentialIssues.length <= 2 ? 'medium' : 'high';
  
  return compatibility;
};

/**
 * Log order-related errors with context
 * @param {Error} error - The error object
 * @param {Object} context - Additional context information
 * @returns {Object} Error log entry
 */
export const logOrderError = (error, context = {}) => {
  const safariInfo = detectSafari();
  const timestamp = new Date().toISOString();
  
  const errorLog = {
    timestamp,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      status: error.status || null,
      text: error.text || null
    },
    context,
    safariInfo,
    environment: {
      userAgent: navigator.userAgent,
      url: window.location.href,
      protocol: window.location.protocol,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      timestamp
    }
  };
  
  // Console logging with appropriate level
  if (safariInfo.isIOSSafari) {
    console.group('🍎 iOS Safari Error Log');
  } else if (safariInfo.isSafari) {
    console.group('🦁 Safari Error Log');
  } else {
    console.group('🐛 Error Log');
  }
  
  console.error('Error:', error);
  console.log('Context:', context);
  console.log('Safari Info:', safariInfo);
  console.log('Full Log:', errorLog);
  console.groupEnd();
  
  // Store in session storage for debugging (if available)
  try {
    const existingLogs = JSON.parse(sessionStorage.getItem('errorLogs') || '[]');
    existingLogs.push(errorLog);
    
    // Keep only last 10 errors to avoid storage overflow
    if (existingLogs.length > 10) {
      existingLogs.splice(0, existingLogs.length - 10);
    }
    
    sessionStorage.setItem('errorLogs', JSON.stringify(existingLogs));
  } catch (storageError) {
    console.warn('Could not store error log:', storageError);
  }
  
  return errorLog;
};

/**
 * Diagnose EmailJS issues specifically for iOS Safari
 * @returns {Promise<Object>} Diagnostic results
 */
export const diagnoseEmailJSIssues = async () => {
  const safariInfo = detectSafari();
  const compatibility = checkEmailJSCompatibility();
  
  console.log('🔍 Starting EmailJS diagnostic...');
  
  const diagnosis = {
    timestamp: new Date().toISOString(),
    safariInfo,
    compatibility,
    tests: {},
    recommendations: []
  };
  
  // Test 1: EmailJS Script Loading
  diagnosis.tests.scriptLoading = {
    passed: !!window.emailjs,
    details: {
      emailJSAvailable: !!window.emailjs,
      emailJSReady: !!window._emailJSReady,
      emailJSFailed: !!window._emailJSFailed
    }
  };
  
  if (!diagnosis.tests.scriptLoading.passed) {
    diagnosis.recommendations.push('EmailJS script failed to load - check network connectivity or ad blockers');
  }
  
  // Test 2: Basic Browser Compatibility
  diagnosis.tests.browserCompatibility = {
    passed: navigator.cookieEnabled && navigator.onLine,
    details: {
      cookiesEnabled: navigator.cookieEnabled,
      online: navigator.onLine,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substring(0, 100) + '...'
    }
  };
  
  if (!diagnosis.tests.browserCompatibility.passed) {
    diagnosis.recommendations.push('Browser compatibility issues detected - enable cookies and check network connection');
  }
  
  // Test 3: iOS Safari Specific Checks
  if (safariInfo.isIOSSafari) {
    diagnosis.tests.iosSafariCompatibility = {
      passed: window.location.protocol === 'https:' && navigator.cookieEnabled,
      details: {
        isSecure: window.location.protocol === 'https:',
        iosVersion: safariInfo.iosVersion,
        isPrivateBrowsing: await isPrivateBrowsing()
      }
    };
    
    if (!diagnosis.tests.iosSafariCompatibility.passed) {
      diagnosis.recommendations.push('iOS Safari specific issues - ensure HTTPS, cookies enabled, and not in private browsing');
    }
  }
  
  // Test 4: EmailJS Function Availability
  if (window.emailjs) {
    diagnosis.tests.emailJSFunctions = {
      passed: typeof window.emailjs.send === 'function' && typeof window.emailjs.init === 'function',
      details: {
        hasInit: typeof window.emailjs.init === 'function',
        hasSend: typeof window.emailjs.send === 'function',
        hasSendForm: typeof window.emailjs.sendForm === 'function'
      }
    };
    
    if (!diagnosis.tests.emailJSFunctions.passed) {
      diagnosis.recommendations.push('EmailJS functions not properly loaded - script may be corrupted');
    }
  }
  
  // Overall assessment
  const allTestsPassed = Object.values(diagnosis.tests).every(test => test.passed);
  diagnosis.overall = {
    status: allTestsPassed ? 'healthy' : 'issues_detected',
    riskLevel: compatibility.riskLevel,
    readyForEmailSending: allTestsPassed && !!window.emailjs && !!window._emailJSReady
  };
  
  console.log('📊 EmailJS Diagnostic Complete:', diagnosis);
  
  return diagnosis;
};

/**
 * Detect if browser is in private/incognito mode
 * @returns {Promise<boolean>} True if private browsing detected
 */
const isPrivateBrowsing = async () => {
  try {
    // Try to use quota API (most reliable method)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const quota = await navigator.storage.estimate();
      return quota.quota < 120000000; // Less than ~120MB usually indicates private mode
    }
    
    // Fallback for older browsers
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return false;
    } catch (e) {
      return true;
    }
  } catch (e) {
    return false;
  }
};

/**
 * Get diagnostic information for troubleshooting
 * @returns {Object} Comprehensive diagnostic info
 */
export const getDiagnosticInfo = () => {
  const safariInfo = detectSafari();
  const compatibility = checkEmailJSCompatibility();
  
  return {
    timestamp: new Date().toISOString(),
    browser: {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      languages: navigator.languages
    },
    safariInfo,
    compatibility,
    emailJS: {
      available: !!window.emailjs,
      ready: !!window._emailJSReady,
      failed: !!window._emailJSFailed,
      functions: window.emailjs ? {
        init: typeof window.emailjs.init,
        send: typeof window.emailjs.send,
        sendForm: typeof window.emailjs.sendForm
      } : null
    },
    location: {
      href: window.location.href,
      protocol: window.location.protocol,
      host: window.location.host,
      pathname: window.location.pathname
    },
    performance: {
      memory: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB'
      } : 'not available'
    }
  };
};

export default {
  detectSafari,
  checkEmailJSCompatibility,
  logOrderError,
  diagnoseEmailJSIssues,
  getDiagnosticInfo
};
