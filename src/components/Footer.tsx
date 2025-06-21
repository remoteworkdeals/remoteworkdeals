import { Link } from 'react-router-dom';
import { Instagram, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-green text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-serif font-bold mb-4 block">
              RemoteWork.Deals
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">Discover the best Colivings around the world and unlock big discounts. Join hundreds of Digital Nomads saving up to 60% on only the best coliving spaces.</p>
            <div className="flex items-center gap-4">
              <a href="https://api.whatsapp.com/send/?phone=31628359453" target="_blank" rel="noopener noreferrer" className="adventure-button">
                Chat on WhatsApp
              </a>
              <div className="flex items-center gap-2 group">
                <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                  Follow us on Instagram
                </span>
                <ArrowRight size={16} className="text-adventure-orange group-hover:translate-x-1 transition-transform duration-300" />
                <a href="https://instagram.com/remotework.deals" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/listings" className="hover:text-white transition-colors">All Listings</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Partners</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/become-partner" className="hover:text-white transition-colors">Become a Partner</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner Resources</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-300">
          <p>© 2024 RemoteWork.Deals. All rights reserved. Built by nomads, for nomads.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
