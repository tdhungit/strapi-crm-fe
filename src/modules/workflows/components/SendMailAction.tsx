import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { camelToTitle } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';

export default function SendMailAction({
  module,
  fields,
}: {
  module: string;
  fields: any[];
}) {
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getClient()
      .collection('email-templates')
      .find()
      .then((res) => {
        setEmailTemplates(res.data);
      });
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProFormSelect
            name={['metadata', 'field']}
            label={`${camelToTitle(module)}: Email Field`}
            options={fields.map((f: any) => ({
              label: camelToTitle(f.label || f.fieldName),
              value: f.fieldName,
            }))}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name={['metadata', 'templateId']}
            label='Email Template'
            options={emailTemplates.map((template: any) => ({
              label: template.title,
              value: template.id,
            }))}
            rules={[
              { required: true, message: 'Please select an email template!' },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProFormText name={['metadata', 'fromEmail']} label='From Email' />
        </Col>
        <Col span={12}>
          <ProFormText name={['metadata', 'fromName']} label='From Name' />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProFormText
            name={['metadata', 'replyToEmail']}
            label='Reply To Email'
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name={['metadata', 'replyToName']}
            label='Reply To Name'
          />
        </Col>
      </Row>
    </div>
  );
}
