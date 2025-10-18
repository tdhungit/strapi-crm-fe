import { ModalForm } from '@ant-design/pro-components';
import { Form, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import FormInput from '../../../components/fields/FormInput';
import { updateEditLayoutColumns } from '../../../helpers/views_helper';
import MetadataService from '../../../services/MetadataService';
import type { CollectionConfigType } from '../../../types/layouts';

export default function EmailTemplateFormModal({
  open,
  data,
  onOpenChange,
  onFinish,
}: {
  open: boolean;
  data?: any;
  onOpenChange: (open: boolean) => void;
  onFinish?: (record: any) => void;
}) {
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
    onFinish?.(values);
    onOpenChange(false);
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
