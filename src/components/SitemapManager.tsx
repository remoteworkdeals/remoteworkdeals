
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, ExternalLink, CheckCircle, Info } from 'lucide-react';
import { generateSitemap, downloadSitemap } from '@/utils/sitemapGenerator';
import { useToast } from '@/hooks/use-toast';

const SitemapManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [sitemapStats, setSitemapStats] = useState<{
    totalUrls: number;
    staticPages: number;
    listings: number;
    blogPosts: number;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      const sitemapContent = await generateSitemap();
      
      // Count URLs for stats
      const urlMatches = sitemapContent.match(/<url>/g);
      const totalUrls = urlMatches ? urlMatches.length : 0;
      
      // Estimate breakdown (static pages are first 6 URLs)
      const staticPages = 6;
      const dynamicUrls = totalUrls - staticPages;
      
      setSitemapStats({
        totalUrls,
        staticPages,
        listings: Math.max(0, dynamicUrls), // Simplified for now
        blogPosts: 0 // Will be updated when blog posts exist
      });
      
      setLastGenerated(new Date().toISOString());
      
      toast({
        title: "Sitemap Generated Successfully",
        description: `Generated sitemap with ${totalUrls} URLs`,
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error Generating Sitemap",
        description: "Failed to generate sitemap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    try {
      await downloadSitemap();
      toast({
        title: "Sitemap Downloaded",
        description: "Sitemap XML file has been downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download sitemap. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            XML Sitemap Generator
          </CardTitle>
          <CardDescription>
            Generate and manage your website's XML sitemap for Google Search Console
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold">Sitemap Status</h3>
              <p className="text-sm text-gray-600">
                {lastGenerated 
                  ? `Last generated: ${new Date(lastGenerated).toLocaleString()}`
                  : 'No sitemap generated yet'
                }
              </p>
            </div>
            <Badge variant={lastGenerated ? "default" : "secondary"}>
              {lastGenerated ? "Generated" : "Not Generated"}
            </Badge>
          </div>

          {/* Stats */}
          {sitemapStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{sitemapStats.totalUrls}</div>
                <div className="text-sm text-gray-600">Total URLs</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{sitemapStats.staticPages}</div>
                <div className="text-sm text-gray-600">Static Pages</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{sitemapStats.listings}</div>
                <div className="text-sm text-gray-600">Listings</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{sitemapStats.blogPosts}</div>
                <div className="text-sm text-gray-600">Blog Posts</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleGenerateSitemap}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Sitemap'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleDownloadSitemap}
              disabled={!lastGenerated}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download XML
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open('https://remotework.deals/sitemap.xml', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Live Sitemap
            </Button>
          </div>

          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">How to submit to Google Search Console:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Generate and download your sitemap using the buttons above</li>
                  <li>Upload the sitemap.xml file to your website's root directory</li>
                  <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Search Console</a></li>
                  <li>Select your property and go to "Sitemaps" in the left menu</li>
                  <li>Add "sitemap.xml" and click "Submit"</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Quick Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">SEO Best Practices</h4>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Regenerate your sitemap whenever you add new listings or blog posts</li>
                  <li>• Your current sitemap includes proper priority levels and change frequencies</li>
                  <li>• All URLs use clean, SEO-friendly slugs based on titles</li>
                  <li>• Last modification dates help search engines understand content freshness</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SitemapManager;
