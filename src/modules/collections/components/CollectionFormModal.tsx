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
  id,
  open,
  onOpenChange,
  onFinish,
}: {
  collectionName: string;
  id?: string;
  open: boolean;
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
