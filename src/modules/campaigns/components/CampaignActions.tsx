import { PlusCircleFilled } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';
import CampaignActionSettingsModal from './CampaignActionSettingsModal';

export default function CampaignActions({ campaign }: { campaign: any }) {
  const [openActionSettings, setOpenActionSettings] = useState(false);

  return (
    <div>
      <ProTable
        size='small'
        headerTitle='Actions'
        dataSource={campaign.campaign_actions}
        rowKey='id'
        search={false}
        options={false}
        pagination={false}
        toolbar={{
          actions: [
            <Button
              type='primary'
              key='create'
              onClick={() => setOpenActionSettings(true)}
            >
              <PlusCircleFilled /> Create Action
            </Button>,
          ],
        }}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Status',
            dataIndex: 'action_status',
            key: 'action_status',
          },
        ]}
      />

      <CampaignActionSettingsModal
        open={openActionSettings}
        onOpenChange={setOpenActionSettings}
      />
    </div>
  );
}
