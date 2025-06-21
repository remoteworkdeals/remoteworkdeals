
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
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
  children?: React.ReactNode;
}

const SEOHead = ({
  title = 'RemoteWork.Deals - Find the Best Coliving Spaces & Remote Work Deals',
  description = 'Discover exclusive deals on coliving spaces worldwide. Perfect for digital nomads, remote workers, and location-independent professionals.',
  keywords = ['coliving', 'remote work', 'digital nomad', 'workation', 'co-living spaces'],
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl,
  noindex = false,
  structuredData,
  children
}: SEOHeadProps) => {
  const location = useLocation();
  const baseUrl = 'https://remotework.deals'; // Update with your actual domain
  const fullCanonicalUrl = canonicalUrl || `${baseUrl}${location.pathname}`;
  const fullImageUrl = image || `${baseUrl}/og-image.jpg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="RemoteWork.Deals" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@remoteworkdeals" />
      
      {/* Article Specific Tags */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta name="theme-color" content="#2D5016" />
      
      {children}
    </Helmet>
  );
};

export default SEOHead;
