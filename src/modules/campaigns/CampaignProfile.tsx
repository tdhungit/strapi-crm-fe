import { useParams } from 'react-router-dom';
import CollectionProfileComponent from '../collections/components/CollectionProfileComponent';

export default function CampaignProfile() {
  const { id } = useParams();

  return (
    <>
      {id && (
        <CollectionProfileComponent
          module='campaigns'
          id={id}
          excludePanels={['campaign_actions']}
        />
      )}
    </>
  );
}
