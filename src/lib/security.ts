/**
 * Validate and sanitize string input with max length
 */
export const validateInput = (input: string | undefined | null, maxLength: number = 255): string => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};



// ===========================================
// Input Sanitization
// ===========================================

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};



// ===========================================
// Security Helpers
// ===========================================



// ===========================================
// OAuth State Validation
// ===========================================

/**
 * Validate OAuth state with expiration check
 * Returns true if valid, false otherwise
 */
export const validateOAuthState = (returnedState: string): boolean => {
  const stored = sessionStorage.getItem('oauth_state');
  if (!stored) return false;
  
  try {
    const { state, expiry } = JSON.parse(stored);
    // Check if expired
    if (Date.now() > expiry) {
      sessionStorage.removeItem('oauth_state');
      return false;
    }
    return state === returnedState;
  } catch {
    return false;
  }
};

/**
 * Clear OAuth state from session storage
 */
export const clearOAuthState = (): void => {
  sessionStorage.removeItem('oauth_state');
};



// ===========================================
// Rate Limiting (Client-side)
// ===========================================

/**
 * Simple client-side rate limiter
 * Note: This is for UX purposes only; real rate limiting should be done server-side
 */
export class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      this.requests.set(key, validRequests);
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  getResetTime(key: string): number | null {
    const requests = this.requests.get(key);
    if (!requests || requests.length === 0) return null;
    const oldest = Math.min(...requests);
    return oldest + this.windowMs;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

// ===========================================
// Content Security Policy Helpers
// ===========================================




// ===========================================
// Password Validation
// ===========================================

// Common passwords list (simplified - in production, use a larger list or API)
const COMMON_PASSWORDS = [
  'password', 'password123', 'password1', '123456', '12345678', '123456789',
  'qwerty', 'abc123', 'monkey', 'master', 'dragon', '111111', 'baseball',
  'iloveyou', 'trustno1', 'sunshine', 'princess', 'welcome', 'shadow',
  'supabase', 'admin123', 'letmein', 'football', 'password1234', 'michael',
  'jennifer', 'jordan', 'admin', 'login', 'passw0rd', 'hello', 'charlie'
];

/**
 * Enhanced password validation with strength checking
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[]; strength: 'weak' | 'medium' | 'strong' } => {
  const errors: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (password.length >= 12) {
    score += 1;
  }
  
  if (password.length >= 16) {
    score += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  // Check against common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common - choose a stronger password');
    score = 0;
  }
  
  // Check for repeated characters (e.g., "aaa", "111")
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters');
  }
  
  // Check for sequential characters (e.g., "123", "abc")
  const sequentialPatterns = ['012', '123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
  const lowerPassword = password.toLowerCase();
  if (sequentialPatterns.some(pattern => lowerPassword.includes(pattern))) {
    errors.push('Password should not contain sequential characters');
  }
  
  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 5 && errors.length === 0) {
    strength = 'strong';
  } else if (score >= 3 && errors.length <= 2) {
    strength = 'medium';
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
};

// ===========================================
// Export all utilities
// ===========================================

export const security = {
  // Validation
  isValidEmail,
  isValidUUID,
  
  // Sanitization
  sanitizeHtml,
  
  // Rate limiting
  ClientRateLimiter,
  
  // OAuth
  validateOAuthState,
  clearOAuthState,
  
  // Password
  validatePassword,
};

export default security;