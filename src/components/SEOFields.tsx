
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface SEOFieldsProps {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onFocusKeywordChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
  title: string;
  content: string;
  slug: string;
}

const SEOFields = ({
  metaTitle,
  metaDescription,
  focusKeyword,
  canonicalUrl,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onFocusKeywordChange,
  onCanonicalUrlChange,
  title,
  content,
  slug
}: SEOFieldsProps) => {
  
  // SEO Analysis Functions
  const analyzeTitleSEO = () => {
    const length = metaTitle.length;
    const hasKeyword = focusKeyword && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase());
    
    if (length === 0) return { status: 'error', message: 'Title is required' };
    if (length < 30) return { status: 'warning', message: 'Title is too short (30+ chars recommended)' };
    if (length > 60) return { status: 'warning', message: 'Title is too long (60 chars max recommended)' };
    if (!hasKeyword && focusKeyword) return { status: 'warning', message: 'Title should include focus keyword' };
    return { status: 'success', message: 'Title looks good!' };
  };

  const analyzeDescriptionSEO = () => {
    const length = metaDescription.length;
    const hasKeyword = focusKeyword && metaDescription.toLowerCase().includes(focusKeyword.toLowerCase());
    
    if (length === 0) return { status: 'warning', message: 'Description recommended for better SEO' };
    if (length < 120) return { status: 'warning', message: 'Description is too short (120+ chars recommended)' };
    if (length > 160) return { status: 'warning', message: 'Description is too long (160 chars max recommended)' };
    if (!hasKeyword && focusKeyword) return { status: 'warning', message: 'Description should include focus keyword' };
    return { status: 'success', message: 'Description looks good!' };
  };

  const analyzeContentSEO = () => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const hasH1 = content.includes('# ');
    const hasH2 = content.includes('## ');
    const keywordDensity = focusKeyword ? 
      (content.toLowerCase().split(focusKeyword.toLowerCase()).length - 1) / wordCount * 100 : 0;
    
    const issues = [];
    if (wordCount < 300) issues.push('Content is too short (300+ words recommended)');
    if (!hasH1) issues.push('Missing H1 heading');
    if (!hasH2) issues.push('Missing H2 headings for better structure');
    if (focusKeyword && keywordDensity < 0.5) issues.push('Focus keyword density is too low');
    if (focusKeyword && keywordDensity > 3) issues.push('Focus keyword density is too high');
    
    if (issues.length === 0) return { status: 'success', message: 'Content SEO looks good!' };
    if (issues.length <= 2) return { status: 'warning', message: issues.join(', ') };
    return { status: 'error', message: issues.join(', ') };
  };

  const titleAnalysis = analyzeTitleSEO();
  const descriptionAnalysis = analyzeDescriptionSEO();
  const contentAnalysis = analyzeContentSEO();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
          🔍 SEO Optimization
          <Badge variant="outline" className="ml-auto">
            {[titleAnalysis, descriptionAnalysis, contentAnalysis].filter(a => a.status === 'success').length}/3 Optimized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        
        {/* Focus Keyword */}
        <div className="space-y-2">
          <Label htmlFor="focus-keyword" className="text-base font-semibold">Focus Keyword</Label>
          <Input
            id="focus-keyword"
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            placeholder="Enter your main keyword for this post"
            className="p-4"
          />
          <p className="text-sm text-gray-500">
            The main keyword you want this post to rank for in search engines
          </p>
        </div>

        {/* Meta Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="meta-title" className="text-base font-semibold">Meta Title</Label>
            {getStatusIcon(titleAnalysis.status)}
          </div>
          <Input
            id="meta-title"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="SEO-optimized title for search engines"
            className="p-4"
          />
          <div className="flex justify-between items-center">
            <p className={`text-sm ${getStatusColor(titleAnalysis.status)}`}>
              {titleAnalysis.message}
            </p>
            <span className="text-sm text-gray-500">
              {metaTitle.length}/60 characters
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="meta-description" className="text-base font-semibold">Meta Description</Label>
            {getStatusIcon(descriptionAnalysis.status)}
          </div>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            rows={3}
            placeholder="Compelling description that will appear in search results"
            className="p-4"
          />
          <div className="flex justify-between items-center">
            <p className={`text-sm ${getStatusColor(descriptionAnalysis.status)}`}>
              {descriptionAnalysis.message}
            </p>
            <span className="text-sm text-gray-500">
              {metaDescription.length}/160 characters
            </span>
          </div>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonical-url" className="text-base font-semibold">Canonical URL (Optional)</Label>
          <Input
            id="canonical-url"
            value={canonicalUrl}
            onChange={(e) => onCanonicalUrlChange(e.target.value)}
            placeholder={`https://yourdomain.com/blog/${slug}`}
            className="p-4"
          />
          <p className="text-sm text-gray-500">
            The preferred URL for this content (to avoid duplicate content issues)
          </p>
        </div>

        {/* Content Analysis */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold">Content Analysis</Label>
            {getStatusIcon(contentAnalysis.status)}
          </div>
          <p className={`text-sm ${getStatusColor(contentAnalysis.status)}`}>
            {contentAnalysis.message}
          </p>
        </div>

        {/* SEO Preview */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold mb-2">Search Engine Preview</h4>
          <div className="space-y-1">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {metaTitle || title || 'Your Blog Post Title'}
            </div>
            <div className="text-green-600 text-sm">
              yourdomain.com/blog/{slug}
            </div>
            <div className="text-gray-600 text-sm">
              {metaDescription || 'Add a meta description to see how your post will appear in search results...'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOFields;
