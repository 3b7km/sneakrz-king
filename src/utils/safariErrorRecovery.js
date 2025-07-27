// Safari/iOS error recovery utilities
import { detectSafari, logOrderError } from './safariDebugger';

export const SAFARI_ERROR_TYPES = {
  EMAILJS_LOADING: 'emailjs_loading',
  EMAILJS_SENDING: 'emailjs_sending',
  FORM_SUBMISSION: 'form_submission',
  LOCALSTORAGE: 'localstorage',
  NETWORK: 'network'
};

export const createSafariErrorRecovery = () => {
  const safariInfo = detectSafari();
  
  return {
    // Enhanced localStorage operations with Safari fallbacks
    safeLocalStorageSet: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`🍎 Safari localStorage failed for ${key}:`, error.message);
        logOrderError(error, { operation: 'localStorage_set', key });
        
        // Try session storage as fallback
        try {
          sessionStorage.setItem(key, JSON.stringify(value));
          console.log(`✅ Fallback to sessionStorage successful for ${key}`);
          return true;
        } catch (sessionError) {
          console.error(`❌ Both localStorage and sessionStorage failed for ${key}`);
          return false;
        }
      }
    },

    safeLocalStorageGet: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn(`🍎 Safari localStorage read failed for ${key}:`, error.message);
        
        // Try session storage as fallback
        try {
          const item = sessionStorage.getItem(key);
          return item ? JSON.parse(item) : defaultValue;
        } catch (sessionError) {
          console.error(`❌ Both localStorage and sessionStorage read failed for ${key}`);
          return defaultValue;
        }
      }
    },

    // Enhanced form submission with Safari retry mechanism
    safariFormSubmit: async (submitFunction, retries = 3) => {
      let lastError;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`🍎 Safari form submit attempt ${attempt}/${retries}`);
          const result = await submitFunction();
          console.log(`✅ Safari form submit succeeded on attempt ${attempt}`);
          return result;
        } catch (error) {
          lastError = error;
          console.warn(`⚠️ Safari form submit failed on attempt ${attempt}:`, error.message);
          
          if (attempt < retries) {
            // Progressive delay: 1s, 2s, 3s
            const delay = attempt * 1000;
            console.log(`🔄 Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      // All attempts failed
      logOrderError(lastError, { 
        operation: 'safari_form_submit',
        attempts: retries,
        finalAttempt: true
      });
      throw lastError;
    },

    // Enhanced EmailJS operations with Safari-specific handling
    safariEmailJSInit: async (publicKey, maxWaitTime = 10000) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const checkEmailJS = () => {
          const elapsed = Date.now() - startTime;
          
          if (window.emailjs && window._emailJSReady) {
            console.log(`✅ EmailJS ready after ${elapsed}ms`);
            resolve(true);
          } else if (window._emailJSFailed) {
            reject(new Error('EmailJS failed to initialize - blocked by browser or network'));
          } else if (elapsed >= maxWaitTime) {
            reject(new Error(`EmailJS timeout after ${elapsed}ms`));
          } else {
            // Check again in 500ms
            setTimeout(checkEmailJS, 500);
          }
        };
        
        // Start checking immediately
        checkEmailJS();
      });
    },

    safariEmailJSSend: async function(serviceId, templateId, templateParams, publicKey) {
      const safariInfo = detectSafari();

      // Enhanced error handling for Safari
      try {
        // Wait for EmailJS to be ready
        await this.safariEmailJSInit(publicKey, 15000);
        
        // Additional Safari-specific checks
        if (!navigator.onLine) {
          throw new Error('Network connection lost');
        }
        
        if (!navigator.cookieEnabled && safariInfo.isIOSSafari) {
          console.warn('⚠️ Cookies disabled - EmailJS may fail on iOS Safari');
        }
        
        console.log('📧 Sending email via Safari-compatible EmailJS...');
        const response = await window.emailjs.send(serviceId, templateId, templateParams, publicKey);
        
        console.log('✅ Email sent successfully via Safari');
        return response;
        
      } catch (error) {
        // Enhanced error reporting for Safari
        const errorContext = {
          operation: 'safari_emailjs_send',
          safariInfo,
          networkOnline: navigator.onLine,
          cookiesEnabled: navigator.cookieEnabled,
          emailJSAvailable: !!window.emailjs,
          emailJSReady: !!window._emailJSReady
        };
        
        logOrderError(error, errorContext);
        
        // Provide Safari-specific error messages
        if (safariInfo.isIOSSafari) {
          if (error.message.includes('Network')) {
            throw new Error('Network connection issue. Please check your internet connection and try again.');
          } else if (error.status === 401) {
            throw new Error('Email service configuration error. Please try again or contact support.');
          } else if (error.status === 429) {
            throw new Error('Too many email attempts. Please wait a moment and try again.');
          }
        }
        
        throw error;
      }
    },

    // Safari-specific network retry mechanism
    safariNetworkRetry: async (networkFunction, retries = 3, baseDelay = 1000) => {
      let lastError;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await networkFunction();
        } catch (error) {
          lastError = error;
          
          if (attempt < retries) {
            // Exponential backoff: 1s, 2s, 4s
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`🔄 Network retry ${attempt}/${retries} in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError;
    },

    // Get Safari-specific error solutions
    getSafariErrorSolution: (error) => {
      const safariInfo = detectSafari();
      
      if (!safariInfo.isIOSSafari) {
        return null;
      }
      
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('emailjs') || errorMessage.includes('email')) {
        return {
          title: 'Email Service Issue on iOS Safari',
          suggestions: [
            'Check your internet connection',
            'Disable any content blockers or ad blockers',
            'Try switching to cellular data if using WiFi',
            'Update your Safari browser to the latest version',
            'Try again in a few minutes'
          ]
        };
      }
      
      if (errorMessage.includes('localstorage') || errorMessage.includes('storage')) {
        return {
          title: 'Storage Issue on iOS Safari',
          suggestions: [
            'Check if Safari is in Private Browsing mode',
            'Clear Safari cache and cookies',
            'Make sure you have storage space available',
            'Allow cookies and website data in Safari settings'
          ]
        };
      }
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return {
          title: 'Network Issue on iOS Safari',
          suggestions: [
            'Check your internet connection',
            'Try switching between WiFi and cellular data',
            'Disable VPN if you\'re using one',
            'Check if other websites work properly'
          ]
        };
      }
      
      return {
        title: 'iOS Safari Compatibility Issue',
        suggestions: [
          'Try refreshing the page',
          'Close other Safari tabs to free up memory',
          'Update iOS to the latest version',
          'Try using a different browser (Chrome, Firefox)',
          'Contact support if the issue persists'
        ]
      };
    }
  };
};

export default createSafariErrorRecovery;
