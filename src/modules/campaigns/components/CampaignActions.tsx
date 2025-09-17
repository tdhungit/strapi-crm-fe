import {
  EditOutlined,
  PlayCircleOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useState } from 'react';
import CampaignActionSettingsModal from './CampaignActionSettingsModal';

export default function CampaignActions({
  campaign,
  onChange,
}: {
  campaign: any;
  onChange?: () => void;
}) {
  const [openActionSettings, setOpenActionSettings] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);

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
              onClick={() => {
                setSelectedActionId(null);
                setOpenActionSettings(true);
              }}
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
            title: 'Field',
            dataIndex: 'field_name',
            key: 'field_name',
          },
          {
            title: 'Target Field',
            dataIndex: 'target_field_name',
            key: 'target_field_name',
          },
          {
            title: 'Status',
            dataIndex: 'action_status',
            key: 'action_status',
            render: (text: any) => {
              return (
                <Tag color={text === 'Ready' ? 'green' : 'red'}>{text}</Tag>
              );
            },
          },
          {
            title: 'Action Type',
            dataIndex: 'action_type',
            key: 'action_type',
            render: (_, record: any) => {
              return (
                <>
                  <Tag
                    color='orange'
                    className='cursor-pointer'
                    onClick={() => {
                      setSelectedActionId(record.id);
                      setOpenActionSettings(true);
                    }}
                  >
                    <EditOutlined />
                  </Tag>
                  <Tag
                    color='red'
                    className='cursor-pointer'
                    onClick={() => {}}
                  >
                    <PlayCircleOutlined />
                  </Tag>
                </>
              );
            },
          },
        ]}
      />

      <CampaignActionSettingsModal
        campaign={campaign}
        actionId={selectedActionId}
        open={openActionSettings}
        onOpenChange={setOpenActionSettings}
        onFinished={onChange}
      />
    </div>
  );
}
