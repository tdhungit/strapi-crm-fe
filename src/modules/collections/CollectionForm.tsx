import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import MetadataService from '../../services/MetadataService';

export default function CollectionForm() {
  const { name: module, id } = useParams();

  const [form] = Form.useForm();

  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
      });
    }
  }, [module]);

  if (!config) {
    return <PageLoading />;
  }

  return (
    <div>
      <h1 className='text-2xl'>
        CollectionForm {module} {id}
      </h1>

      <div className='w-full bg-white mt-4 p-4 rounded-lg'>
        <Form form={form} layout='vertical'>
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
                    <Form.Item
                      name={item.name}
                      label={item.label || item.name}
                      rules={
                        item.required
                          ? [{ required: true, message: `${item.label || item.name} is required` }]
                          : []
                      }
                    >
                      <Input
                        placeholder={item.placeholder || `Enter ${item.label || item.name}`}
                        size='large'
                      />
                    </Form.Item>
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
