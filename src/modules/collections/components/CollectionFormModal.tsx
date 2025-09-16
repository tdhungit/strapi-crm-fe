import { ModalForm } from '@ant-design/pro-components';
import { App, Form } from 'antd';
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
  defaultConfig,
}: {
  collectionName: string;
  open: boolean;
  id?: string;
  parentCollectionName?: string;
  parentRecord?: any;
  relateField?: any;
  defaultConfig?: any;
  onOpenChange: (open: boolean) => void;
  onFinish: (values: any) => void;
}) {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const [config, setConfig] = useState<any>({});
  const [data, setData] = useState<any>({});

  const getConfig = async (collectionName: string) => {
    if (defaultConfig) {
      return defaultConfig;
    }
    return MetadataService.getCollectionConfigurations(collectionName);
  };

  useEffect(() => {
    if (collectionName) {
      getConfig(collectionName).then((res) => {
        setConfig(res);
      });
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
          notification.error({
            message: 'Failed to fetch data',
          });
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
    try {
      message.loading('Saving...');
      let newRecord;
      if (id) {
        newRecord = await ApiService.getClient()
          .collection(collectionName)
          .update(id, values);
      } else {
        newRecord = await ApiService.getClient()
          .collection(collectionName)
          .create(values);
      }
      message.destroy();
      notification.success({
        message: 'Saved successfully',
      });
      onFinish?.(newRecord.data);
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
