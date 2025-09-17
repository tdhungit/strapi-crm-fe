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
          name={['actionSettings', 'emailTemplateId']}
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
        />

        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              label='From Email'
              name={['actionSettings', 'fromEmail']}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              label='From Name'
              name={['actionSettings', 'fromName']}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              label='Reply To Email'
              name={['actionSettings', 'replyToEmail']}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              label='Reply To Name'
              name={['actionSettings', 'replyToName']}
            />
          </Col>
        </Row>
      </ProCard>
    </div>
  );
}
