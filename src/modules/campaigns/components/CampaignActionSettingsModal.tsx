import { ModalForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { camelToTitle } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import type { ContentTypeAttributeType } from '../../../types/content-types';
import ActionSchedule from './actions/ActionSchedule';
import SendEmailSettings from './actions/SendEmailSettings';

export default function CampaignActionSettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form] = ProForm.useForm();

  const contentType = MetadataService.getContentTypeByUid(
    'api::campaign.campaign'
  );

  let allFields: ContentTypeAttributeType[] = [];
  const fields: ContentTypeAttributeType[] = [];
  if (contentType) {
    allFields = MetadataService.getContentTypeListFields(contentType);
    // manyToOne fields
    allFields.forEach((fieldOptions) => {
      if (
        fieldOptions.type === 'relation' &&
        fieldOptions.relation === 'manyToMany'
      ) {
        fields.push({ ...fieldOptions });
      }
    });
  }

  const actionSettings = {
    Send_Email: SendEmailSettings,
  };
  const [action, setAction] = useState<string>('');
  const [componentSettings, setComponentSettings] =
    useState<React.ReactNode>(null);
  useEffect(() => {
    if (action) {
      const Component = actionSettings[action as keyof typeof actionSettings];
      setComponentSettings(<Component />);
    }
  }, [action]);

  const [relateFields, setRelateFields] = useState<ContentTypeAttributeType[]>(
    []
  );
  const getRelationFields = (relateFieldName: string) => {
    const fieldOptions = allFields.find(
      (field) => field.name === relateFieldName
    );
    if (fieldOptions?.target) {
      const targetContentType = MetadataService.getContentTypeByUid(
        fieldOptions.target
      );
      if (targetContentType) {
        const targetFields =
          MetadataService.getContentTypeListFields(targetContentType);
        setRelateFields(targetFields);
      }
    } else {
      setRelateFields([]);
    }
  };

  const handleSave = async (values: any) => {
    console.log('values', values);
  };

  return (
    <ModalForm
      form={form}
      title='Campaign Action Settings'
      open={open}
      onOpenChange={onOpenChange}
      colProps={{
        span: 24,
      }}
      onFinish={handleSave}
    >
      <ProFormSelect
        name='name'
        label='Action Name'
        placeholder='Select an action'
        request={async () => {
          try {
            const response = await ApiService.request(
              'get',
              '/campaign-actions/actions'
            );
            return response || [];
          } catch (error) {
            console.error('Failed to fetch campaign actions:', error);
            return [];
          }
        }}
        onChange={(value: string) => {
          setAction(value);
        }}
      />

      <Row gutter={16}>
        <Col span={12}>
          <ProFormSelect
            name='field_name'
            label='Field'
            placeholder='Select a field to apply action to'
            options={
              fields.length > 0
                ? fields.map((field) => ({
                    label: camelToTitle(field.name || ''),
                    value: field.name,
                  }))
                : []
            }
            onChange={(value: string) => {
              getRelationFields(value);
            }}
          />
        </Col>

        <Col span={12}>
          <ProFormSelect
            name='target_field_name'
            label='Target Field'
            placeholder='Select a target field'
            options={
              relateFields.length > 0
                ? relateFields.map((field) => ({
                    label: camelToTitle(field.name || ''),
                    value: field.name,
                  }))
                : []
            }
          />
        </Col>
      </Row>

      {componentSettings}

      <ActionSchedule />
    </ModalForm>
  );
}
