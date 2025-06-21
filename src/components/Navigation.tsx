
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Main navigation component with mobile-first responsive design
 * Features collapsible mobile menu and search functionality
 */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Coliving Deals', path: '/coliving-deals' },
    { name: 'Exclusive Deals', path: '/exclusive-deals' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-serif font-bold text-forest-green">
              RemoteWork.Deals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48 xl:w-64 border-gray-300 focus:border-forest-green focus:ring-forest-green"
                />
              </div>
            </form>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors text-sm xl:text-base ${
                  isActive(item.path)
                    ? 'text-adventure-orange border-b-2 border-adventure-orange'
                    : 'text-forest-green hover:text-adventure-orange'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/exclusive-deals">
              <button className="adventure-button text-sm xl:text-base py-2 xl:py-3 px-4 xl:px-6">
                More discounts?
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-forest-green hover:text-adventure-orange p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-forest-green focus:ring-forest-green text-base"
                  />
                </div>
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium py-3 px-2 transition-colors text-base ${
                    isActive(item.path)
                      ? 'text-adventure-orange'
                      : 'text-forest-green hover:text-adventure-orange'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/exclusive-deals">
                <button 
                  className="adventure-button w-full mt-4 py-3 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  More discounts?
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
