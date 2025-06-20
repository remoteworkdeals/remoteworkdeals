
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLinkedBlogPosts } from '@/hooks/useLinkedBlogPosts';
import { useNavigate } from 'react-router-dom';

interface LinkedBlogPostsProps {
  listingId: number;
}

const LinkedBlogPosts = ({ listingId }: LinkedBlogPostsProps) => {
  const { linkedPosts, loading } = useLinkedBlogPosts(listingId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (linkedPosts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-forest-green">
          Read more about this Coliving
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {linkedPosts.map((post) => (
            <div 
              key={post.id}
              className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              {post.featured_image && (
                <div className="flex-shrink-0">
                  <img
                    src={post.featured_image}
                    alt={post.featured_image_alt || post.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  {post.read_time && (
                    <span className="text-sm text-gray-500">{post.read_time}</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 hover:text-adventure-orange transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedBlogPosts;
