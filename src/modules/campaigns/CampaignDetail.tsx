import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';
import CampaignActions from './components/CampaignActions';

export default function CampaignDetail() {
  const { id } = useParams();

  const [refresh, setRefresh] = useState(0);

  return (
    <>
      {id && (
        <>
          <CollectionDetailComponent
            module='campaigns'
            id={id}
            populate={['campaign_actions']}
            excludePanels={['campaign_actions']}
            refresh={refresh}
            hook={(record) => (
              <div className='mt-4'>
                <CampaignActions
                  campaign={record.data}
                  onChange={() => setRefresh((prev) => prev + 1)}
                />
              </div>
            )}
          />
        </>
      )}
    </>
  );
}
