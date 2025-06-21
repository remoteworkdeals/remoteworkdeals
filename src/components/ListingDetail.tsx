
import ListingDetailOriginal from './ListingDetailOriginal';

interface ListingDetailProps {
  listingId: number;
}

const ListingDetail = ({ listingId }: ListingDetailProps) => {
  return <ListingDetailOriginal listingId={listingId} />;
};

export default ListingDetail;
