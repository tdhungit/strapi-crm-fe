import { ModalForm } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  capitalizeFirstLetter,
  renderEditLayoutRows,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';

export default function CollectionFormModal({
  collectionName,
  open,
  id,
  parentCollectionName,
  parentRecord,
  relateField,
  onOpenChange,
  onFinish,
}: {
  collectionName: string;
  open: boolean;
  id?: string;
  parentCollectionName?: string;
  parentRecord?: any;
  relateField?: any;
  onOpenChange: (open: boolean) => void;
  onFinish: (values: any) => void;
}) {
  const [form] = Form.useForm();

  const [config, setConfig] = useState<any>({});
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (collectionName) {
      MetadataService.getCollectionConfigurations(collectionName).then(
        (res) => {
          setConfig(res);
        }
      );
    }
  }, [collectionName]);

  useEffect(() => {
    if (form && collectionName && id) {
      // Fetch user data for editing
      ApiService.getClient()
        .collection(collectionName)
        .findOne(id, { populate: '*' })
        .then((res) => {
          form.setFieldsValue(res?.data);
          setData(res?.data);
        })
        .catch(() => {
          message.error('Failed to fetch data');
        });
    }
  }, [id, form, collectionName]);

  useEffect(() => {
    if (parentCollectionName && relateField?.mappedBy && parentRecord?.id) {
      const parentContentType =
        MetadataService.getContentTypeByModule(parentCollectionName);
      const mainField = parentContentType?.settings?.mainField || 'name';
      const d = {
        ...data,
        [relateField.mappedBy]: {
          id: parentRecord.id,
          [mainField]: parentRecord[mainField] || '',
        },
      };
      setData(d);
    }
  }, [parentCollectionName, parentRecord, relateField]);

  const onSave = async (values: any) => {
    onFinish?.(values);
  };

  return (
    <ModalForm
      title={`${id ? 'Edit' : 'Add'} ${capitalizeFirstLetter(collectionName)}`}
      open={open}
      onOpenChange={onOpenChange}
      onFinish={onSave}
      form={form}
      layout='vertical'
    >
      {renderEditLayoutRows(config, data, form)}
    </ModalForm>
  );
}
