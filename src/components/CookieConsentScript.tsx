
import { useEffect } from 'react';

/**
 * Minimal cookie consent using CookieConsent.io
 * Replaces the previous React-based implementation with a simpler approach
 */
const CookieConsentScript = () => {
  useEffect(() => {
    // Add CookieConsent.io script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js';
    script.async = true;
    document.head.appendChild(script);

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .cc-window.cc-banner {
        background-color: rgba(0, 0, 0, 0.75) !important;
        color: #ffffff !important;
        font-size: 14px !important;
        border-radius: 6px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        bottom: 20px !important;
        left: 20px !important;
        right: auto !important;
        width: auto !important;
        max-width: 300px;
      }

      .cc-btn.cc-dismiss {
        background-color: #4caf50 !important;
        color: #ffffff !important;
        font-size: 13px !important;
        padding: 6px 12px !important;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);

    // Initialize CookieConsent when script loads
    script.onload = () => {
      if (window.cookieconsent) {
        window.cookieconsent.initialise({
          palette: {
            popup: { background: "rgba(0,0,0,0.75)", text: "#fff" },
            button: { background: "#4caf50", text: "#fff" }
          },
          position: "bottom-left",
          theme: "classic",
          type: "opt-in",
          content: {
            message: "We use cookies to improve your experience.",
            dismiss: "OK",
            link: "Privacy",
            href: "/privacy-policy"
          }
        });
      }
    };

    // Cleanup function
    return () => {
      // Remove script and style if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CookieConsentScript;
