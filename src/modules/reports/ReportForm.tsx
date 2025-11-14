import { SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import { App, Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AssignUserInput from '../../components/fields/assign-user/AssignUserInput';
import { availableCollections } from '../../config/collections';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import MetadataService from '../../services/MetadataService';
import QueryBuilder from './components/QueryBuilder';
// import { exportQuery, toStrapiFilters } from './utils/queryExport';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';

export default function ReportForm() {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const [selectedModule, setSelectedModule] = useState<string>('');
  const [treeObj, setTreeObj] = useState<ImmutableTree>();
  const [treeConfig, setTreeConfig] = useState<Config>();

  const contentTypes = MetadataService.getSavedContentTypes();

  // const reportCT = contentTypes.find((ct) => ct.collectionName === 'reports');

  const availableContentTypes = contentTypes.filter((ct) =>
    availableCollections.includes(ct.collectionName)
  );
  const moduleOptions = availableContentTypes.map((ct) => ({
    label: ct.displayName,
    value: ct.collectionName,
  }));

  const handleQueryChange = (tree: ImmutableTree, config: Config) => {
    setTreeObj(tree);
    setTreeConfig(config);

    // Export query in different formats
    // const exported = exportQuery(tree, config);
    // const strapiFilters = toStrapiFilters(tree, config);

    // console.log('Query Tree:', tree);
    // console.log('Query Exports:', exported);
    // console.log('Strapi Filters:', strapiFilters);
  };

  const handleSave = () => {
    const formData = form.getFieldsValue();
    const data = {
      name: formData.name,
      assigned_user: formData.assigned_user?.value || user.id,
      metadata: {
        module: selectedModule,
        tree: treeObj,
        config: treeConfig,
      },
    };

    message.loading('Saving report...', 0);
    ApiService.getClient()
      .collection('reports')
      .create(data)
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Report saved successfully',
        });
        navigate('/collections/reports');
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: 'Error',
          description: 'Failed to save report',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <PageContainer
      header={{
        title: 'Report Builder',
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: [
            {
              path: '/',
              title: 'Home',
            },
            { path: '/collections/reports', title: 'Reports' },
            {
              title: 'Report Builder',
            },
          ],
        },
      }}
    >
      <div className='flex flex-col gap-2'>
        <Card title='Report Builder' size='small'>
          <Form layout='vertical' form={form}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='name'
                  label='Report Name'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a report name',
                    },
                  ]}
                >
                  <Input placeholder='Enter a report name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='assigned_user' label='Assigned User'>
                  <AssignUserInput
                    item={{
                      options: {
                        target: 'plugin::users-permissions.user',
                        mainField: 'username',
                      },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label='Select Collection' required>
              <Select
                placeholder='Choose a collection to query'
                options={moduleOptions}
                value={selectedModule || undefined}
                onChange={setSelectedModule}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Form>
        </Card>

        {selectedModule && (
          <Card title='Query Builder' size='small'>
            <QueryBuilder
              module={selectedModule}
              onChange={handleQueryChange}
            />
          </Card>
        )}

        <div className='flex justify-start mt-2'>
          <Button type='primary' icon={<SaveOutlined />} onClick={handleSave}>
            Generate Report
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
