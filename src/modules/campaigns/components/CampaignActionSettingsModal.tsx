import { ModalForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { camelToTitle } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import type { RootState } from '../../../stores';
import type { ContentTypeAttributeType } from '../../../types/content-types';
import ActionSchedule from './actions/ActionSchedule';
import SendEmailSettings from './actions/SendEmailSettings';

export default function CampaignActionSettingsModal({
  open,
  campaign,
  actionId,
  onOpenChange,
  onFinished,
}: {
  open: boolean;
  campaign: any;
  actionId?: number | null;
  onOpenChange: (open: boolean) => void;
  onFinished?: () => void;
}) {
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();
  const user = useSelector((state: RootState) => state.auth.user);

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

  useEffect(() => {
    if (actionId) {
      const campaignAction = campaign.campaign_actions.find(
        (action: any) => action.id === actionId
      );
      if (campaignAction) {
        form.setFieldsValue(campaignAction);
        setAction(campaignAction.name);
      }
    }
  }, [actionId]);

  const handleSave = async (values: any) => {
    const isValid = await form.validateFields();
    if (!isValid) {
      notification.error({
        message: 'Form validation failed',
      });
      return;
    }

    message.loading('Saving...', 0);
    try {
      if (actionId) {
        const campaignAction = campaign.campaign_actions.find(
          (action: any) => action.id === actionId
        );

        if (campaignAction) {
          await ApiService.getClient()
            .collection('campaign-actions')
            .update(campaignAction.documentId, values);
        } else {
          message.destroy();
          notification.error({
            message: 'Campaign action not found',
          });
          return;
        }
      } else {
        await ApiService.getClient()
          .collection('campaign-actions')
          .create({
            campaign: campaign.id,
            user: user.id,
            action_status: 'Ready',
            ...values,
          });
      }
      message.destroy();
      notification.success({
        message: 'Saved successfully',
      });
      onOpenChange(false);
      onFinished?.();
    } catch (error: any) {
      console.error(error);
      message.destroy();
      notification.error({
        message: error?.response?.data?.error?.message || 'Failed to save',
      });
    }
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
        rules={[{ required: true, message: 'Please select an action' }]}
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
            rules={[{ required: true, message: 'Please select a field' }]}
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
            rules={[
              { required: true, message: 'Please select a target field' },
            ]}
          />
        </Col>
      </Row>

      {componentSettings}

      <ActionSchedule />
    </ModalForm>
  );
}
