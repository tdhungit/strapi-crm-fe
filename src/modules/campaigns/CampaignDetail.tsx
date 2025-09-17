import { useParams } from 'react-router-dom';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';

export default function CampaignDetail() {
  const { id } = useParams();

  return <>{id && <CollectionDetailComponent module='campaigns' id={id} />}</>;
}
