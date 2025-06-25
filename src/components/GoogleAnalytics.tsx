
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = () => {
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    // Make gtag available globally
    (window as any).gtag = gtag;
    
    // Initialize gtag
    gtag('js', new Date());
    gtag('config', 'G-K54T808N7K');
  }, []);

  return (
    <Helmet>
      {/* Google tag (gtag.js) */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-K54T808N7K"
      />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-K54T808N7K');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
