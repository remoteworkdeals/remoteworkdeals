
import ListingDetailEnhanced from './ListingDetailEnhanced';

interface ListingDetailProps {
  listingId: number;
}

const ListingDetail = ({ listingId }: ListingDetailProps) => {
  return <ListingDetailEnhanced listingId={listingId} />;
};

export default ListingDetail;
