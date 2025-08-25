import { Button, Col, Form, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import FormInput from '../../form-types/FormInput';
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
      await ApiService.getClient().collection(module).create(values);
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
    <div>
      <h1 className='text-2xl mb-4 uppercase'>{id ? `Edit ${module}` : `Create ${module}`}</h1>

      <div className='w-full bg-white mt-4 p-4 rounded-lg'>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          {config?.layouts?.edit?.map((line: any[], lineIndex: number) => (
            <Row
              key={`line-${lineIndex}`}
              gutter={[16, 16]}
              className='mb-4'
              style={{ width: '100%' }}
            >
              {line.map((item: any) => {
                const metadatas = config.metadatas?.[item.name]?.edit || {};
                const field = config.fields?.[item.name] || {};
                metadatas.type = field.type || 'string';
                item = {
                  ...item,
                  ...metadatas,
                  options: field,
                };
                return (
                  <Col key={item.name} xs={24} sm={12} md={12} lg={12}>
                    <FormInput form={form} item={item} data={data} />
                  </Col>
                );
              })}
            </Row>
          ))}
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
    </div>
  );
}
