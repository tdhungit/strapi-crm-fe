import {
  ProCard,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import ApiService from '../../../../services/ApiService';

export default function SendEmailSettings() {
  const { message } = App.useApp();
  return (
    <div className='mb-4'>
      <ProCard bordered>
        <ProFormSelect
          label='Email Template'
          name={['metadata', 'actionSettings', 'emailTemplateId']}
          showSearch={true}
          request={async (params) => {
            try {
              const response = await ApiService.getClient()
                .collection('email-templates')
                .find({
                  filters: {
                    title: {
                      $contains: params?.keyWords,
                    },
                  },
                });
              const data = response.data || [];
              return data.map((item) => ({
                label: item.title,
                value: item.id,
              }));
            } catch (error) {
              message.error('Failed to fetch email templates');
              console.error('Failed to fetch email templates:', error);
              return [];
            }
          }}
          rules={[
            {
              required: true,
              message: 'Please select an email template',
            },
          ]}
        />

        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              label='From Email'
              name={['metadata', 'actionSettings', 'fromEmail']}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              label='From Name'
              name={['metadata', 'actionSettings', 'fromName']}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              label='Reply To Email'
              name={['metadata', 'actionSettings', 'replyToEmail']}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              label='Reply To Name'
              name={['metadata', 'actionSettings', 'replyToName']}
            />
          </Col>
        </Row>
      </ProCard>
    </div>
  );
}
