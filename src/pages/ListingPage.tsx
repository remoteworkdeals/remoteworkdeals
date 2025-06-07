
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ListingDetail from '@/components/ListingDetail';

const ListingPage = () => {
  const { id } = useParams();
  const listingId = parseInt(id || '1');

  return (
    <div className="min-h-screen">
      <Navigation />
      <ListingDetail listingId={listingId} />
      <Footer />
    </div>
  );
};

export default ListingPage;
