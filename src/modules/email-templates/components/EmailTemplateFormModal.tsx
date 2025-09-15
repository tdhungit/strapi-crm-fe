import { ModalForm } from '@ant-design/pro-components';
import { App, Form, type FormInstance } from 'antd';
import type { Editor } from 'grapesjs';
import { useEffect, useState } from 'react';
import FormInput from '../../../components/fields/FormInput';
import { updateEditLayoutColumns } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import type { CollectionConfigType } from '../../../types/layouts';
import { getEditorHtml } from './builders/common';

export default function EmailTemplateFormModal({
  open,
  data,
  editor,
  onOpenChange,
  onFinish,
}: {
  open: boolean;
  data?: any;
  editor?: Editor;
  onOpenChange: (open: boolean) => void;
  onFinish?: (record: any) => void;
}) {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    MetadataService.getCollectionConfigurations('email-templates').then(
      (res) => {
        setConfig(res);
      }
    );
  }, []);

  useEffect(() => {
    if (form && data) {
      form.setFieldsValue(data);
    }
  }, [form, data]);

  const renderEditLayoutRows = (
    config: CollectionConfigType,
    record: any,
    form: FormInstance
  ) => {
    const editLayout = updateEditLayoutColumns(config);
    const rows: any[] = [];
    editLayout.forEach((line) => {
      line.forEach((item) => {
        if (['content', 'rawContent'].includes(item.name)) {
          return;
        }

        const fieldOptions = item.options;
        rows.push(
          <div key={`line-${item.name}`} className='mb-4 w-full'>
            <FormInput form={form} item={fieldOptions} data={record} />
          </div>
        );
      });
    });
    return rows;
  };

  const handleSave = async (values: any) => {
    try {
      if (editor) {
        const projectData = await editor.store();
        const htmlContent = getEditorHtml(editor);

        values.content = htmlContent;
        values.rawContent = {
          projectData,
        };
      }

      let record;
      message.loading('Saving...', 0);
      if (data?.documentId) {
        record = await ApiService.getClient()
          .collection('email-templates')
          .update(data.documentId, values);
      } else {
        record = await ApiService.getClient()
          .collection('email-templates')
          .create(values);
      }

      message.destroy();
      notification.success({
        message: 'Saved successfully',
      });
      onOpenChange(false);
      onFinish?.(record);
    } catch (error) {
      message.destroy();
      notification.error({
        message: 'Failed to save',
      });
      console.error('Form validation failed:', error);
    }
  };

  return (
    <ModalForm
      open={open}
      onOpenChange={onOpenChange}
      width={600}
      form={form}
      onFinish={handleSave}
    >
      {renderEditLayoutRows(config, data, form)}
    </ModalForm>
  );
}
