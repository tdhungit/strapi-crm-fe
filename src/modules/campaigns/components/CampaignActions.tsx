import { Table } from 'antd';

export default function CampaignActions({ campaign }: { campaign: any }) {
  return (
    <div>
      <Table
        size='small'
        dataSource={campaign.campaign_actions}
        rowKey='id'
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
    </div>
  );
}
