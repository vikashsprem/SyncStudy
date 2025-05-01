// Polyfills for SockJS and other libraries that expect Node.js globals
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof process === 'undefined') {
  window.process = {
    env: { DEBUG: undefined }
  };
}

// Simple Buffer polyfill for browser environment
if (typeof Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: () => false
  };
}

export default function setupPolyfills() {
  console.log('Polyfills initialized');
} 