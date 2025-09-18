import { useParams } from 'react-router-dom';
import CollectionProfileComponent from '../collections/components/CollectionProfileComponent';
import CampaignActions from './components/CampaignActions';

export default function CampaignProfile() {
  const { id } = useParams();

  return (
    <>
      {id && (
        <CollectionProfileComponent
          module='campaigns'
          id={id}
          excludePanels={['campaign_actions']}
          populate={['campaign_actions']}
          beforeTabs={(record) => [
            {
              key: 'campaign_actions',
              label: 'Campaign Actions',
              children: <CampaignActions campaign={record} />,
            },
          ]}
        />
      )}
    </>
  );
}
