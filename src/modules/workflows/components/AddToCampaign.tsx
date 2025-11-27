import { ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';

export default function AddToCampaign() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getClient()
      .collection('campaigns')
      .find()
      .then((res: any) => {
        setCampaigns(res.data);
      });
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProFormSelect
            name={['metadata', 'campaignId']}
            label='Campaign'
            options={campaigns.map((campaign: any) => ({
              label: campaign.name,
              value: campaign.id,
            }))}
            rules={[{ required: true, message: 'Please select a campaign!' }]}
          />
        </Col>
      </Row>
    </div>
  );
}
