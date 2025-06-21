
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object;
}

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();
  const baseUrl = 'https://remotework.deals'; // Update with your actual domain
  
  useEffect(() => {
    const {
      title = 'RemoteWork.Deals - Find the Best Coliving Spaces & Remote Work Deals',
      description = 'Discover exclusive deals on coliving spaces worldwide. Perfect for digital nomads, remote workers, and location-independent professionals.',
      keywords = ['coliving', 'remote work', 'digital nomad', 'workation', 'co-living spaces'],
      image = `${baseUrl}/og-image.jpg`,
      type = 'website',
      author,
      publishedTime,
      modifiedTime,
      canonicalUrl,
      noindex = false,
      structuredData
    } = seoData;

    // Set document title
    document.title = title;

    // Helper function to set meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    // Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', canonicalUrl || `${baseUrl}${location.pathname}`, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:site_name', 'RemoteWork.Deals', true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:site', '@remoteworkdeals');

    // Article specific tags
    if (type === 'article' && author) {
      setMetaTag('article:author', author, true);
    }
    
    if (publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
    }
    
    if (modifiedTime) {
      setMetaTag('article:modified_time', modifiedTime, true);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl || `${baseUrl}${location.pathname}`;

    // Structured data
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (scriptTag) {
        scriptTag.remove();
      }
      
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }

  }, [seoData, location.pathname]);
};
