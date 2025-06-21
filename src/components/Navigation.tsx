
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

/**
 * Main navigation component with mobile-first responsive design
 * Features collapsible mobile menu and enhanced search functionality
 */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Coliving Deals', path: '/coliving-deals' },
    { name: 'Exclusive Deals', path: '/exclusive-deals' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

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
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {/* Enhanced Search Bar - Desktop */}
            <SearchBar 
              className="w-64 xl:w-80" 
              placeholder="Search"
            />

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors text-sm xl:text-base whitespace-nowrap ${
                  isActive(item.path)
                    ? 'text-adventure-orange border-b-2 border-adventure-orange'
                    : 'text-forest-green hover:text-adventure-orange'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/exclusive-deals">
              <button className="adventure-button text-sm xl:text-base py-2 xl:py-3 px-4 xl:px-6 whitespace-nowrap">
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
              {/* Enhanced Mobile Search */}
              <SearchBar 
                className="mb-2" 
                placeholder="Search"
              />

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
