import { CodeOutlined, EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';
import CampaignActionSettingsModal from './components/CampaignActionSettingsModal';
import CampaignActions from './components/CampaignActions';

export default function CampaignDetail() {
  const { id } = useParams();

  const [openActionSettings, setOpenActionSettings] = useState(false);

  return (
    <>
      {id && (
        <>
          <CollectionDetailComponent
            module='campaigns'
            id={id}
            populate={['campaign_actions']}
            extra={[
              <Link
                key={`campaigns-edit-${id}`}
                to={`/collections/campaigns/edit/${id}`}
              >
                <Button variant='solid' color='orange'>
                  <EditFilled /> Edit
                </Button>
              </Link>,
              <Link key={'campaigns-action-settings'} to={``}>
                <Button
                  variant='solid'
                  color='blue'
                  onClick={() => setOpenActionSettings(true)}
                >
                  <CodeOutlined />
                </Button>
              </Link>,
            ]}
            excludePanels={['campaign_actions']}
            hook={(record) => (
              <div className='mt-4'>
                <CampaignActions campaign={record.data} />
              </div>
            )}
          />

          <CampaignActionSettingsModal
            open={openActionSettings}
            onOpenChange={setOpenActionSettings}
          />
        </>
      )}
    </>
  );
}
