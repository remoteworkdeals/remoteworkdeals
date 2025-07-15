
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Index from "./pages/Index";
import ColivingDeals from "./pages/ColivingDeals";
import ListingPage from "./pages/ListingPage";
import About from "./pages/About";
import ExclusiveDeals from "./pages/ExclusiveDeals";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BecomePartner from "./pages/BecomePartner";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlog from "./pages/AdminBlog";
import AdminListings from "./pages/AdminListings";
import AdminAddListing from "./pages/AdminAddListing";
import Auth from "./pages/Auth";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <GoogleAnalytics />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/coliving-deals" element={<ColivingDeals />} />
              <Route path="/colivings/:slug" element={<ListingPage />} />
              <Route path="/listing/:id" element={<ListingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/exclusive-deals" element={<ExclusiveDeals />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/become-partner" element={<BecomePartner />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog" element={
                <ProtectedRoute>
                  <AdminBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/listings" element={
                <ProtectedRoute>
                  <AdminListings />
                </ProtectedRoute>
              } />
              <Route path="/admin/listings/new" element={
                <ProtectedRoute>
                  <AdminAddListing />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsentBanner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
