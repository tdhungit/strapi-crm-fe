import { SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { Config, ImmutableTree } from '@react-awesome-query-builder/antd';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Transfer,
} from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AssignUserInput from '../../components/fields/assign-user/AssignUserInput';
import SqlInput from '../../components/fields/sql/SqlInput';
import { availableCollections } from '../../config/collections';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';
import type { RootState } from '../../stores';
import type { ContentTypeAttributeType } from '../../types/content-types';
import QueryBuilder from './components/QueryBuilder';
import ReportResultModal from './components/ReportResultModal';
import { loadTreeFromJson } from './utils/queryExport';

export default function ReportForm() {
  const { id } = useParams();

  const user = useSelector((state: RootState) => state?.auth?.user);
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const [selectedModule, setSelectedModule] = useState<string>('');
  const [treeObj, setTreeObj] = useState<ImmutableTree>();
  const [treeConfig, setTreeConfig] = useState<Config>();
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [queryType, setQueryType] = useState<string>('');
  const [rawQuery, setRawQuery] = useState<string>('');

  const contentTypes = MetadataService.getSavedContentTypes();

  // const reportCT = contentTypes.find((ct) => ct.collectionName === 'reports');

  const availableContentTypes = contentTypes.filter((ct) =>
    availableCollections.includes(ct.collectionName)
  );
  const moduleOptions = availableContentTypes.map((ct) => ({
    label: ct.displayName,
    value: ct.collectionName,
  }));

  useEffect(() => {
    if (!selectedModule || queryType === 'query') {
      setAvailableFields([]);
      setSelectedFields([]);
      return;
    }

    const collection = MetadataService.getContentTypeByModule(selectedModule);
    if (!collection) return;

    const fields: any[] = [];

    Object.entries(collection.attributes).forEach(
      ([fieldName, fieldAttr]: [string, ContentTypeAttributeType]) => {
        // Skip localizations and complex types
        if (fieldName === 'localizations' || fieldAttr.type === 'component') {
          return;
        }

        const formatFieldLabel = (name: string): string => {
          return (
            name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')
          );
        };

        // Handle relation fields
        if (fieldAttr.type === 'relation' && fieldAttr.target) {
          const relatedContentType = MetadataService.getContentTypeByUid(
            fieldAttr.target
          );
          if (relatedContentType) {
            Object.entries(relatedContentType.attributes).forEach(
              ([relatedFieldName, relatedFieldAttr]: [
                string,
                ContentTypeAttributeType
              ]) => {
                if (
                  relatedFieldName === 'localizations' ||
                  relatedFieldAttr.type === 'relation' ||
                  relatedFieldAttr.type === 'component'
                ) {
                  return;
                }
                fields.push({
                  key: `${fieldName}.${relatedFieldName}`,
                  title: `${formatFieldLabel(fieldName)} > ${formatFieldLabel(
                    relatedFieldName
                  )}`,
                });
              }
            );
          }
        } else {
          fields.push({
            key: fieldName,
            title: formatFieldLabel(fieldName),
          });
        }
      }
    );

    setAvailableFields(fields);
    // Auto-select common fields
    const autoSelect = fields
      .filter((f) =>
        ['id', 'name', 'title', 'createdAt', 'updatedAt'].includes(f.key)
      )
      .map((f) => f.key);
    setSelectedFields(autoSelect);
  }, [selectedModule]);

  useEffect(() => {
    if (!id) {
      setQueryType('filters');
      return;
    }

    ApiService.getClient()
      .collection('reports')
      .findOne(id)
      .then((res) => {
        const data = res.data;

        setQueryType(data.metadata.queryType || 'filters');
        setSelectedModule(data.metadata.module);

        setRawQuery(
          (data.metadata.queryType === 'query' && data.metadata.query) || ''
        );
        setSelectedFields(data.metadata.selectedFields);

        if (data.metadata.tree) {
          setTreeObj(loadTreeFromJson(data.metadata.tree));
        }

        form.setFieldsValue({
          name: data.name,
          assigned_user: data.assigned_user,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleQueryChange = (tree: ImmutableTree, config: Config) => {
    setTreeObj(tree);
    setTreeConfig(config);
  };

  const checkValidQuery = (query: string) => {
    return ApiService.request('post', '/reports/extra/is-valid-query', {
      query,
    });
  };

  const generateReport = () => {
    if (queryType === 'filters' && (!treeObj || !treeConfig)) {
      return;
    }

    if (queryType === 'query' && !rawQuery) {
      return;
    }

    form
      .validateFields()
      .then(() => {
        if (queryType === 'query') {
          if (!rawQuery) {
            notification.error({
              message: 'Error',
              description: 'Query is required',
            });
            return;
          }

          message.loading('Checking query validity...', 0);
          checkValidQuery(rawQuery)
            .then(() => {
              setOpenReportModal(true);
            })
            .catch(() => {
              notification.error({
                message: 'Error',
                description: 'Query is not valid',
              });
            })
            .finally(() => {
              message.destroy();
            });
        } else {
          setOpenReportModal(true);
        }
      })
      .catch(() => {
        message.error('Please fill in all required fields');
      });
  };

  const handleSave = (
    query: any,
    filters: any,
    jsonTree: any,
    fields?: any[]
  ) => {
    const formData = form.getFieldsValue();
    const data = {
      name: formData.name,
      assigned_user: formData.assigned_user?.value || user?.id || null,
      metadata: {
        module: selectedModule,
        queryType,
        tree: jsonTree,
        query: queryType === 'query' ? rawQuery : query || '',
        filters,
        fields: fields || undefined,
        selectedFields,
      },
    };

    let service;
    if (id) {
      service = ApiService.getClient().collection('reports').update(id, data);
    } else {
      service = ApiService.getClient().collection('reports').create(data);
    }

    message.loading('Saving report...', 0);
    service
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

            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
                <Form.Item label='Query Type' required>
                  <Select value={queryType} onChange={setQueryType}>
                    <Select.Option value='filters'>Query Builder</Select.Option>
                    <Select.Option value='query'>Query</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {queryType === 'query' && selectedModule && (
          <Card title='Query' size='small'>
            <Alert
              message='Enter your query here and ensure it is valid and limited to 1000 results'
              type='info'
            />
            <div className='mt-2'>
              <SqlInput value={rawQuery} onChange={setRawQuery} />
            </div>
          </Card>
        )}

        {queryType === 'filters' &&
          selectedModule &&
          availableFields.length > 0 && (
            <Card title='Select Fields to Display' size='small'>
              <Transfer
                dataSource={availableFields}
                titles={['Available Fields', 'Selected Fields']}
                targetKeys={selectedFields}
                onChange={(targetKeys) =>
                  setSelectedFields(targetKeys as string[])
                }
                render={(item: any) => item.title}
                listStyle={{
                  width: '100%',
                  height: 400,
                }}
                showSearch
                filterOption={(inputValue: string, item: any) =>
                  item.title.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Card>
          )}

        {queryType === 'filters' && selectedModule && (
          <Card title='Query Builder' size='small'>
            <QueryBuilder
              module={selectedModule}
              value={treeObj || undefined}
              onChange={handleQueryChange}
              onInit={(_tree, config) => {
                setTreeConfig(config);
              }}
            />
          </Card>
        )}

        <div className='flex justify-start mt-2'>
          <Button
            type='primary'
            icon={<SaveOutlined />}
            onClick={generateReport}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {((selectedModule &&
        treeObj &&
        treeConfig &&
        selectedFields &&
        selectedFields.length > 0) ||
        (queryType === 'query' && rawQuery)) && (
        <ReportResultModal
          open={openReportModal}
          onOpenChange={setOpenReportModal}
          module={selectedModule}
          query={rawQuery}
          tree={treeObj}
          config={treeConfig}
          selectedFields={selectedFields}
          onFinish={(query, filters, jsonTree, fields) =>
            handleSave(query, filters, jsonTree, fields)
          }
        />
      )}
    </PageContainer>
  );
}
