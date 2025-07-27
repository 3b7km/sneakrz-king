// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Egyptian phone number validation
  const phoneRegex = /^(\+20|20|0)?1[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validateInstagram = (username) => {
  // Instagram username validation (alphanumeric, dots, underscores, 1-30 chars)
  const instagramRegex = /^[a-zA-Z0-9._]{1,30}$/;
  return instagramRegex.test(username);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().trim().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().trim().length <= maxLength;
};

// Validation rules for checkout form
export const checkoutValidationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    label: "First Name",
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    label: "Last Name",
  },
  email: {
    required: false,
    email: true,
    label: "Email Address",
  },
  phone: {
    required: true,
    phone: true,
    label: "Phone Number",
  },
  instagram: {
    required: false,
    instagram: true,
    label: "Instagram Username",
  },
  streetAddress: {
    required: true,
    minLength: 5,
    maxLength: 200,
    label: "Street Address",
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
    label: "City",
  },
  state: {
    required: false,
    label: "State",
  },
  country: {
    required: true,
    label: "Country",
  },
};

// Main validation function
export const validateField = (
  fieldName,
  value,
  rules = checkoutValidationRules,
) => {
  const rule = rules[fieldName];
  if (!rule) return { isValid: true, error: null };

  const errors = [];

  // Required validation
  if (rule.required && !validateRequired(value)) {
    errors.push(`${rule.label} is required`);
  }

  // If field is empty and not required, skip other validations
  if (!value && !rule.required) {
    return { isValid: true, error: null };
  }

  // Email validation
  if (rule.email && value && !validateEmail(value)) {
    errors.push(`Please enter a valid email address`);
  }

  // Phone validation
  if (rule.phone && value && !validatePhone(value)) {
    errors.push(`Please enter a valid Egyptian phone number`);
  }

  // Minimum length validation
  if (rule.minLength && value && !validateMinLength(value, rule.minLength)) {
    errors.push(
      `${rule.label} must be at least ${rule.minLength} characters long`,
    );
  }

  // Maximum length validation
  if (rule.maxLength && value && !validateMaxLength(value, rule.maxLength)) {
    errors.push(`${rule.label} must not exceed ${rule.maxLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null,
  };
};

// Validate entire form
export const validateForm = (formData, rules = checkoutValidationRules) => {
  const errors = {};
  let isFormValid = true;

  Object.keys(rules).forEach((fieldName) => {
    const validation = validateField(fieldName, formData[fieldName], rules);
    if (!validation.isValid) {
      errors[fieldName] = validation.error;
      isFormValid = false;
    }
  });

  return {
    isValid: isFormValid,
    errors,
  };
};

// Get error message for display
export const getErrorMessage = (fieldName, errors) => {
  return errors[fieldName] || null;
};

// Check if field has error
export const hasError = (fieldName, errors) => {
  return Boolean(errors[fieldName]);
};

export default {
  validateField,
  validateForm,
  getErrorMessage,
  hasError,
  checkoutValidationRules,
};
