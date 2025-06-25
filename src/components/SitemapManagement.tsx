
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ExternalLink, CheckCircle, AlertCircle, Copy, Download, Globe } from 'lucide-react';
import { generateComprehensiveSitemap, downloadSitemap, copySitemapToClipboard } from '@/utils/sitemapService';
import { useToast } from '@/hooks/use-toast';

const SitemapManagement = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [sitemapStats, setSitemapStats] = useState<{
    totalUrls: number;
    staticPages: number;
    listings: number;
    blogPosts: number;
  } | null>(null);
  const [generatedSitemap, setGeneratedSitemap] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating sitemap from admin dashboard...');
      const result = await generateComprehensiveSitemap();
      
      if (result.success && result.sitemap) {
        setGeneratedSitemap(result.sitemap);
        setLastGenerated(new Date().toISOString());
        
        // Parse sitemap to get stats
        const urlMatches = result.sitemap.match(/<url>/g);
        const staticCount = 6; // Known static pages
        const totalUrls = urlMatches?.length || 0;
        const listingMatches = result.sitemap.match(/\/colivings\//g);
        const blogMatches = result.sitemap.match(/\/blog\//g);
        
        setSitemapStats({
          totalUrls,
          staticPages: staticCount,
          listings: listingMatches?.length || 0,
          blogPosts: (blogMatches?.length || 0) - 1 // Subtract 1 for /blog page itself
        });
        
        toast({
          title: "Sitemap Generated Successfully",
          description: `Generated sitemap with ${totalUrls} URLs`,
        });
      } else {
        throw new Error(result.error || 'Failed to generate sitemap');
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error Generating Sitemap",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    setIsDownloading(true);
    try {
      const result = await downloadSitemap();
      
      if (result.success) {
        toast({
          title: "Sitemap Downloaded",
          description: "Upload the downloaded sitemap.xml file to your public folder and deploy",
        });
      } else {
        throw new Error(result.error || 'Failed to download sitemap');
      }
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      toast({
        title: "Error Downloading Sitemap",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySitemap = async () => {
    setIsCopying(true);
    try {
      const result = await copySitemapToClipboard();
      
      if (result.success) {
        toast({
          title: "Sitemap Copied",
          description: "Sitemap XML copied to clipboard",
        });
      } else {
        throw new Error(result.error || 'Failed to copy sitemap');
      }
    } catch (error) {
      console.error('Error copying sitemap:', error);
      toast({
        title: "Error Copying Sitemap",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const copySitemapUrl = () => {
    const sitemapUrl = 'https://remotework.deals/sitemap.xml';
    navigator.clipboard.writeText(sitemapUrl);
    toast({
      title: "URL Copied",
      description: "Sitemap URL copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          SEO Sitemap Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Generate and manage your website sitemap for Google Search Console
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copySitemapUrl}
                className="flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy Sitemap URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://remotework.deals/sitemap.xml', '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View Live Sitemap
              </Button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGenerateSitemap}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Sitemap'}
          </Button>
          
          {generatedSitemap && (
            <>
              <Button
                onClick={handleDownloadSitemap}
                disabled={isDownloading}
                variant="default"
                className="flex items-center gap-2"
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-spin' : ''}`} />
                {isDownloading ? 'Downloading...' : 'Download XML'}
              </Button>
              
              <Button
                onClick={handleCopySitemap}
                disabled={isCopying}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className={`h-4 w-4 ${isCopying ? 'animate-spin' : ''}`} />
                {isCopying ? 'Copying...' : 'Copy XML'}
              </Button>
            </>
          )}
        </div>

        {lastGenerated && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Last generated: {new Date(lastGenerated).toLocaleString()}
          </div>
        )}

        {sitemapStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-forest-green">{sitemapStats.totalUrls}</div>
              <div className="text-sm text-gray-600">Total URLs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sitemapStats.staticPages}</div>
              <div className="text-sm text-gray-600">Static Pages</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{sitemapStats.listings}</div>
              <div className="text-sm text-gray-600">Listings</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{sitemapStats.blogPosts}</div>
              <div className="text-sm text-gray-600">Blog Posts</div>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Google Search Console Setup</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click "Generate Sitemap" to create XML with all content</li>
                <li>• Download the XML file and replace public/sitemap.xml</li>
                <li>• Deploy your changes to make the sitemap live</li>
                <li>• Submit https://remotework.deals/sitemap.xml to Google Search Console</li>
                <li>• Regenerate and redeploy when adding new content</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitemapManagement;
