import { PageContainer } from '@ant-design/pro-components';
import { App, Button, Form } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../../../components/PageLoading';
import { normalizeRecord } from '../../../helpers/collection_helper';
import {
  breadcrumbItemRender,
  camelToTitle,
  renderEditLayoutRows,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';

export default function CollectionFormComponent({
  module,
  id,
  onValuesChange,
}: {
  module: string;
  id?: string;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  [key: string]: any;
}) {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [config, setConfig] = useState<any>({});
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
      });
    }
  }, [module]);

  useEffect(() => {
    if (form && module && id) {
      // Fetch user data for editing
      ApiService.getClient()
        .collection(module)
        .findOne(id, { populate: '*' })
        .then((res) => {
          form.setFieldsValue(res?.data);
          setData(res?.data);
        })
        .catch(() => {
          message.error('Failed to fetch data');
        });
    }
  }, [id, form, module]);

  const onFinish = async (values: any) => {
    if (!module) {
      return;
    }

    try {
      message.loading('Saving...');
      const normalizedValues = normalizeRecord(values, config);
      if (id) {
        await ApiService.getClient()
          .collection(module)
          .update(id, normalizedValues);
      } else {
        await ApiService.getClient()
          .collection(module)
          .create(normalizedValues);
      }
      message.destroy();
      notification.success({
        message: 'Saved successfully',
      });

      navigate(`/collections/${module}`);
    } catch (error: any) {
      console.error(error);
      message.destroy();
      notification.error({
        message: error?.response?.data?.error?.message || 'Failed to save',
      });
    }
  };

  if (!config?.layouts) {
    return <PageLoading />;
  }

  return (
    <PageContainer
      header={{
        title: id
          ? `Edit ${camelToTitle(module)}`
          : `Create ${camelToTitle(module)}`,
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: camelToTitle(module || ''),
              href: `/collections/${module}`,
            },
            ...(id
              ? [
                  {
                    title: 'Detail',
                    href: `/collections/${module}/detail/${id}`,
                  },
                ]
              : []),
            {
              title: id ? 'Edit' : 'Create',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-md'>
        <Form
          key={`${module}-${id || 0}`}
          form={form}
          layout='vertical'
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          {renderEditLayoutRows(config, data, form)}
          <div className='flex gap-2'>
            <Button type='primary' htmlType='submit'>
              Save
            </Button>
            <Button type='default' htmlType='button'>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </PageContainer>
  );
}
