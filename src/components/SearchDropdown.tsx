
import { SearchResult } from '@/hooks/useSearch';
import { Link } from 'react-router-dom';
import { MapPin, FileText, Loader2 } from 'lucide-react';

interface SearchDropdownProps {
  results: SearchResult[];
  isLoading: boolean;
  hasQuery: boolean;
  onSelect: () => void;
  className?: string;
}

const SearchDropdown = ({ 
  results, 
  isLoading, 
  hasQuery, 
  onSelect,
  className = '' 
}: SearchDropdownProps) => {
  if (!hasQuery) return null;

  return (
    <div className={`absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto ${className}`}>
      {isLoading ? (
        <div className="p-4 text-center">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="py-2">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={result.url}
              onClick={onSelect}
              className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {result.type === 'listing' ? (
                  <MapPin className="h-4 w-4 text-adventure-orange" />
                ) : (
                  <FileText className="h-4 w-4 text-forest-green" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {result.title}
                  </h4>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                    result.type === 'listing' 
                      ? 'bg-adventure-orange/10 text-adventure-orange' 
                      : 'bg-forest-green/10 text-forest-green'
                  }`}>
                    {result.type === 'listing' ? 'Listing' : 'Blog'}
                  </span>
                </div>
                {result.location && (
                  <p className="text-xs text-gray-500 mb-1">{result.location}</p>
                )}
                {result.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{result.description}</p>
                )}
              </div>
            </Link>
          ))}
          {results.length >= 5 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <Link
                to={`/blog?search=${encodeURIComponent('')}`}
                onClick={onSelect}
                className="text-sm text-adventure-orange hover:text-adventure-orange/80 font-medium"
              >
                View all results →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">No results found</p>
          <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
