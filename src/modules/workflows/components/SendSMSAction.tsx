import { ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { camelToTitle } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';

export default function SendSMSAction({
  module,
  fields,
}: {
  module: string;
  fields: any[];
}) {
  const [smsTemplates, setSmsTemplates] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getClient()
      .collection('email-templates')
      .find()
      .then((res) => {
        setSmsTemplates(res.data);
      });
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProFormSelect
            name={['metadata', 'field']}
            label={`${camelToTitle(module)}: Phone Number Field`}
            options={fields.map((f: any) => ({
              label: camelToTitle(f.label || f.fieldName),
              value: f.fieldName,
            }))}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name={['metadata', 'templateId']}
            label='Template'
            options={smsTemplates.map((template: any) => ({
              label: template.title,
              value: template.id,
            }))}
          />
        </Col>
      </Row>
    </div>
  );
}
