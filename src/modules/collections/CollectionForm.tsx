import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import {
  capitalizeFirstLetter,
  renderEditLayoutRows,
} from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function CollectionForm() {
  const { name: module, id } = useParams();

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
      if (id) {
        await ApiService.getClient().collection(module).update(id, values);
      } else {
        await ApiService.getClient().collection(module).create(values);
      }
      message.destroy();
      message.success('Saved successfully');

      navigate(`/collections/${module}`);
    } catch (error: any) {
      console.error(error);
      message.destroy();
      message.error('Failed to save');
    }
  };

  if (!config?.layouts) {
    return <PageLoading />;
  }

  return (
    <PageContainer
      header={{
        title: id
          ? `Edit ${module}`.toLocaleUpperCase()
          : `Create ${module}`.toLocaleUpperCase(),
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: capitalizeFirstLetter(module || ''),
              href: `/collections/${module}`,
            },
            id
              ? {
                  title: 'Detail',
                  href: `/collections/${module}/detail/${id}`,
                }
              : {},
            {
              title: id ? 'Edit' : 'Create',
            },
          ],
        },
      }}
    >
      <div className='w-full bg-white mt-4 p-4 rounded-lg'>
        <Form
          key={`${module}-${id || 0}`}
          form={form}
          layout='vertical'
          onFinish={onFinish}
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
