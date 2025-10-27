import {
  BranchesOutlined,
  FilterOutlined,
  GroupOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { breadcrumbItemRender, camelToTitle } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';
import SendMailAction from './components/SendMailAction';
import SendSMSAction from './components/SendSMSAction';

const { Text } = Typography;

export default function WorkflowForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { message, notification } = App.useApp();

  const [form] = ProForm.useForm();

  const [module, setModule] = useState('');
  const [moduleFields, setModuleFields] = useState<any>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [trigger, setTrigger] = useState('');
  const [formValues, setFormValues] = useState<any>({});

  const formValueChange = (value: any, allValues: any) => {
    setFormValues(allValues);

    if (value.trigger) {
      setTrigger(value.trigger);
    }

    if (value.module) {
      setModule(value.module);
    }
  };

  const normalizeRes = (res: { data: any; meta: any }) => {
    const data = {
      module: res.data.module,
      name: res.data.name,
      trigger: res.data.trigger,
      actions: res.data.workflow_actions || [],
      conditionGroups: res.data.metadata?.conditions || [],
      status: res.data.workflow_status,
      run_at: res.data.run_at,
      id: res.data.id,
      documentId: res.data.documentId,
    };

    return data;
  };

  useEffect(() => {
    ApiService.request('GET', '/crm-workflows/extra/actions').then((res) => {
      setActions(res);
    });
  }, []);

  useEffect(() => {
    if (module) {
      const ct = MetadataService.getContentTypeByModule(module);
      if (ct?.attributes) {
        const fields: any = [];
        for (const fieldName in ct.attributes) {
          fields.push({
            fieldName,
            ...ct.attributes[fieldName],
          });
        }
        setModuleFields(fields);
      }
    }
  }, [module]);

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('crm-workflows')
        .findOne(id, { populate: { workflow_actions: true } })
        .then((res: any) => {
          form.setFieldsValue(normalizeRes(res));
          formValueChange(normalizeRes(res), normalizeRes(res));
        });
    }
  }, [id]);

  const handleSave = async (values: any) => {
    if (!values.name) {
      notification.error({
        message: 'Name is required',
      });
      return;
    }

    if (!values.module) {
      notification.error({
        message: 'Module is required',
      });
      return;
    }

    if (!values.trigger) {
      notification.error({
        message: 'Trigger is required',
      });
      return;
    }

    const saveData: any = {
      name: values.name,
      module: values.module,
      trigger: values.trigger,
      workflow_status: values.status || 'Active',
      run_at: values.run_at,
      metadata: {
        conditions: values.conditionGroups,
      },
      actions: values.actions,
    };

    let service;
    if (id) {
      service = ApiService.getClient()
        .collection('crm-workflows')
        .update(id, saveData);
    } else {
      service = ApiService.getClient()
        .collection('crm-workflows')
        .create(saveData);
    }

    message.loading('Saving...', 0);
    service
      .then((res: any) => {
        notification.success({
          message: 'Saved successfully',
        });

        if (!id) {
          if (res?.data?.documentId) {
            navigate(`/collections/workflows/detail/${res.data.documentId}`);
          } else {
            navigate('/collections/workflows');
          }
        }
      })
      .catch((error: any) => {
        notification.error({
          message: error?.response?.data?.error?.message || 'Failed to save',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  /**
   * Get appropriate operators based on field type
   * Different field types support different comparison operations
   */
  const getOperatorsByFieldType = (fieldType: string) => {
    const baseOperators = [
      { label: '= Equal', value: 'eq' },
      { label: '≠ Not Equal', value: 'ne' },
    ];

    switch (fieldType) {
      case 'number':
      case 'integer':
      case 'float':
      case 'date':
      case 'datetime':
        return [
          ...baseOperators,
          { label: '> Greater Than', value: 'gt' },
          { label: '< Less Than', value: 'lt' },
          { label: '≥ Greater or Equal', value: 'gte' },
          { label: '≤ Less or Equal', value: 'lte' },
          { label: '∈ In List', value: 'in' },
        ];

      case 'string':
      case 'text':
      case 'richtext':
        return [
          ...baseOperators,
          { label: '⊃ Contains', value: 'contains' },
          { label: '⊅ Not Contains', value: 'notContains' },
          { label: '∈ In List', value: 'in' },
        ];

      case 'enumeration':
        return [...baseOperators, { label: '∈ In List', value: 'in' }];

      case 'boolean':
        return baseOperators;

      case 'relation':
        return [...baseOperators, { label: '∈ In List', value: 'in' }];

      default:
        return [
          ...baseOperators,
          { label: '> Greater Than', value: 'gt' },
          { label: '< Less Than', value: 'lt' },
          { label: '≥ Greater or Equal', value: 'gte' },
          { label: '≤ Less or Equal', value: 'lte' },
          { label: '∈ In List', value: 'in' },
          { label: '⊃ Contains', value: 'contains' },
          { label: '⊅ Not Contains', value: 'notContains' },
        ];
    }
  };

  /**
   * Render appropriate value input field based on field type
   * Supports: datetime, number, boolean, enumeration, relation, string/text
   * Also handles special cases like 'in' operator for multiple values
   */
  const renderValueField = (fieldName: string, operator: string) => {
    const field = moduleFields.find((f: any) => f.fieldName === fieldName);
    if (!field) {
      return (
        <ProFormText
          name='value'
          label={
            <span className='flex items-center'>
              <PlayCircleOutlined className='mr-1 text-purple-500' />
              Value
            </span>
          }
          placeholder='Enter comparison value'
        />
      );
    }

    const fieldType = field.type || 'string';
    const fieldName_path = 'value';

    const label = (
      <span className='flex items-center'>
        <PlayCircleOutlined className='mr-1 text-purple-500' />
        Value
      </span>
    );

    // For 'in' operator, allow multiple values
    if (operator === 'in') {
      return (
        <ProFormSelect
          name={fieldName_path}
          label={label}
          placeholder='Select values'
          mode='multiple'
          options={
            fieldType === 'enumeration' && field.enum
              ? field.enum.map((value: string) => ({
                  label: value,
                  value: value,
                }))
              : []
          }
        />
      );
    }

    // Render based on field type
    switch (fieldType) {
      case 'date':
      case 'datetime':
        return (
          <ProFormDatePicker
            name={fieldName_path}
            label={label}
            placeholder='Select date'
            fieldProps={{
              style: { width: '100%' },
              format:
                fieldType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
              showTime: fieldType === 'datetime',
            }}
          />
        );

      case 'number':
      case 'integer':
      case 'float':
        return (
          <ProFormDigit
            name={fieldName_path}
            label={label}
            placeholder='Enter number'
            fieldProps={{
              style: { width: '100%' },
            }}
          />
        );

      case 'boolean':
        return (
          <ProFormSwitch
            name={fieldName_path}
            label={label}
            fieldProps={{
              size: 'default',
            }}
          />
        );

      case 'enumeration':
        return (
          <ProFormSelect
            name={fieldName_path}
            label={label}
            placeholder='Select value'
            options={
              field.enum
                ? field.enum.map((value: string) => ({
                    label: value,
                    value: value,
                  }))
                : []
            }
          />
        );

      case 'relation':
        // For relations, you might want to implement a special selector
        // For now, using text input as fallback
        return (
          <ProFormText
            name={fieldName_path}
            label={label}
            placeholder={`Enter ${field.target || 'related'} ID`}
          />
        );

      case 'string':
      case 'text':
      case 'richtext':
      default:
        return (
          <ProFormText
            name={fieldName_path}
            label={label}
            placeholder='Enter text value'
          />
        );
    }
  };

  // Render a single condition
  const renderCondition = (
    _meta: any,
    groupIndex: number,
    conditionIndex: number
  ) => {
    return (
      <div className='w-full mb-6'>
        {/* Logic operator for combining conditions within a group (AND/OR) - only shown from the second condition */}
        {conditionIndex > 0 && (
          <div className='mb-2'>
            <div className='flex items-center justify-center'>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent'></div>
              <div className='px-4'>
                <ProFormSelect
                  name='logic'
                  options={[
                    { label: '🔗 AND', value: 'AND' },
                    { label: '🔀 OR', value: 'OR' },
                  ]}
                  initialValue='AND'
                  fieldProps={{
                    style: {
                      width: 120,
                    },
                  }}
                />
              </div>
              <div className='flex-1 h-px bg-gradient-to-r from-blue-300 via-blue-300 to-transparent'></div>
            </div>
          </div>
        )}

        {/* Condition item */}
        <Card
          size='small'
          className='shadow-sm hover:shadow-md transition-shadow duration-200'
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
          }}
        >
          <div className='flex items-center mb-3'>
            <FilterOutlined className='text-blue-500 mr-2' />
            <Text strong className='text-gray-700'>
              Condition {conditionIndex + 1}
            </Text>
          </div>

          <Row gutter={[16, 16]} align='middle'>
            <Col span={7}>
              <ProFormSelect
                name='field'
                label={
                  <span className='flex items-center'>
                    <SettingOutlined className='mr-1 text-blue-500' />
                    Field
                  </span>
                }
                placeholder='Select a field'
                options={moduleFields.map((field: any) => ({
                  label: camelToTitle(field.label || field.fieldName),
                  value: field.fieldName,
                }))}
              />
            </Col>

            <Col span={5}>
              {(() => {
                const currentField =
                  formValues?.conditionGroups?.[groupIndex]?.conditions?.[
                    conditionIndex
                  ]?.field;
                const field = moduleFields.find(
                  (f: any) => f.fieldName === currentField
                );
                const fieldType = field?.type || 'string';

                return (
                  <ProFormSelect
                    name='operator'
                    label={
                      <span className='flex items-center'>
                        <BranchesOutlined className='mr-1 text-green-500' />
                        Operator
                      </span>
                    }
                    placeholder='Choose operator'
                    options={getOperatorsByFieldType(fieldType)}
                    initialValue='eq'
                  />
                );
              })()}
            </Col>

            <Col span={12}>
              {(() => {
                const currentField =
                  formValues?.conditionGroups?.[groupIndex]?.conditions?.[
                    conditionIndex
                  ]?.field;
                const currentOperator =
                  formValues?.conditionGroups?.[groupIndex]?.conditions?.[
                    conditionIndex
                  ]?.operator || 'eq';

                return renderValueField(currentField, currentOperator);
              })()}
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  // Render a condition group
  const renderConditionGroup = (_meta: any, groupIndex: number) => {
    return (
      <Card
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
          marginBottom: 10,
        }}
        title={
          <>
            <GroupOutlined className='mr-2 text-blue-500' />
            Condition Group {groupIndex + 1}
          </>
        }
        extra={<Tag color='blue'>{groupIndex + 1}</Tag>}
      >
        <div className='flex justify-between items-center mb-6'>
          {groupIndex > 0 && (
            <ProFormSelect
              name='logic'
              options={[
                { label: 'AND', value: 'and' },
                { label: 'OR', value: 'or' },
              ]}
              label={false}
              placeholder='Select group logic'
              initialValue='and'
            />
          )}
        </div>

        <ProFormList
          name='conditions'
          creatorButtonProps={{
            creatorButtonText: 'Add New Condition',
            icon: <PlusOutlined />,
            type: 'dashed',
            size: 'large',
            style: {
              width: '100%',
              borderColor: '#1890ff',
              color: '#1890ff',
            },
          }}
        >
          {(conditionMeta, conditionIndex) =>
            renderCondition(conditionMeta, groupIndex, conditionIndex)
          }
        </ProFormList>
      </Card>
    );
  };

  // Render a Action Form
  const renderActionForm = (index: number) => {
    const actionName = formValues?.actions?.[index]?.name || '';
    let component = null;
    switch (actionName) {
      case 'Send_Email':
        component = SendMailAction;
        break;
      case 'Send_Sms':
        component = SendSMSAction;
        break;
      default:
        return <></>;
    }

    return React.createElement(component, {
      module,
      fields: moduleFields,
    });
  };

  // Render a action
  const renderAction = (_meta: any, index: number) => {
    return (
      <Card
        className='shadow-sm hover:shadow-md transition-shadow duration-200'
        title={
          <>
            <PlaySquareOutlined className='mr-2 text-green-500' />
            Action {index + 1}
          </>
        }
        style={{ marginBottom: 10 }}
        extra={<Tag color='green'>{index + 1}</Tag>}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <ProFormSelect
              name='name'
              label={
                <span className='flex items-center'>
                  <SettingOutlined className='mr-1 text-blue-500' />
                  Action
                </span>
              }
              placeholder='Select an action'
              options={actions.map((action: string) => ({
                label: camelToTitle(action),
                value: action,
              }))}
              rules={[
                {
                  required: true,
                  message: 'Please select an action',
                },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormSwitch name='is_repeat' label='Repeat' />
          </Col>
        </Row>

        {renderActionForm(index)}
      </Card>
    );
  };

  return (
    <>
      <PageContainer
        header={{
          title: id ? 'Edit Workflow' : 'New Workflow',
          breadcrumb: {
            itemRender: breadcrumbItemRender,
            items: [
              {
                title: 'Home',
                href: '/',
              },
              {
                title: 'Workflows',
                href: '/collections/workflows',
              },
              ...(id
                ? [
                    {
                      title: 'Detail',
                      href: `/collections/workflows/detail/${id}`,
                    },
                  ]
                : []),
              {
                title: id ? 'Edit' : 'New',
              },
            ],
          },
        }}
        className='custom-antd-pro-form'
      >
        <ProForm
          form={form}
          onValuesChange={formValueChange}
          submitter={{
            searchConfig: {
              submitText: 'Save Workflow',
            },
            render: (props) => {
              return [
                <Button
                  key='save'
                  type='primary'
                  size='large'
                  icon={<SaveOutlined />}
                  onClick={() => props.form?.submit?.()}
                  className='bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-lg px-8 w-full'
                >
                  Save Workflow
                </Button>,
              ];
            },
          }}
          onFinish={handleSave}
        >
          <Space className='w-full mb-4' direction='vertical'>
            {/* Basic Information Card */}
            <Card
              title={
                <div className='flex items-center'>
                  <SettingOutlined className='mr-2 text-blue-500' />
                  <span>Basic Information</span>
                </div>
              }
              className='shadow-sm'
              extra={
                <Tag color='green'>
                  <InfoCircleOutlined className='mr-1' />
                  Required
                </Tag>
              }
            >
              <Alert
                message='Workflow Configuration'
                description='Set up the basic details for your workflow including name, target module, and trigger conditions.'
                type='info'
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <ProFormText
                    name='name'
                    label='Workflow Name'
                    placeholder='Enter a descriptive name'
                    rules={[
                      { required: true, message: 'Please enter workflow name' },
                    ]}
                  />
                </Col>
                <Col span={8}>
                  <ProFormSelect
                    name='module'
                    label='Target Module'
                    placeholder='Select target module'
                    options={[
                      {
                        label: '👥 Leads',
                        value: 'leads',
                      },
                      {
                        label: '📞 Contacts',
                        value: 'contacts',
                      },
                      {
                        label: '🏢 Accounts',
                        value: 'accounts',
                      },
                    ]}
                    rules={[
                      { required: true, message: 'Please select a module' },
                    ]}
                  />
                </Col>
                <Col span={8}>
                  <ProFormSelect
                    name='trigger'
                    label='Trigger'
                    placeholder='When should this run?'
                    options={[
                      {
                        label: '⏰ Before Create',
                        value: 'beforeCreate',
                      },
                      {
                        label: '✅ After Create',
                        value: 'afterCreate',
                      },
                      {
                        label: '📝 Before Update',
                        value: 'beforeUpdate',
                      },
                      {
                        label: '🔄 After Update',
                        value: 'afterUpdate',
                      },
                      {
                        label: '🎯 Custom Conditions',
                        value: 'conditions',
                      },
                    ]}
                    rules={[
                      { required: true, message: 'Please select a trigger' },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <ProFormSelect
                    name='status'
                    label='Status'
                    placeholder='Select status'
                    options={[
                      {
                        label: 'Active',
                        value: 'Active',
                      },
                      {
                        label: 'Inactive',
                        value: 'Inactive',
                      },
                    ]}
                    rules={[
                      { required: true, message: 'Please select a status' },
                    ]}
                    initialValue={'Active'}
                  />
                </Col>
                <Col span={8}>
                  <ProFormDatePicker
                    name='run_at'
                    label='Run At'
                    placeholder='Select date'
                    fieldProps={{
                      style: { width: '100%' },
                      format: 'YYYY-MM-DD HH:mm:ss',
                      showTime: true,
                    }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Conditions Section */}
            {trigger === 'conditions' && (
              <Card
                title={
                  <div className='flex items-center'>
                    <FilterOutlined className='mr-2 text-blue-500' />
                    <span>Condition Groups</span>
                  </div>
                }
                className='shadow-sm'
                extra={
                  <Tag color='blue'>
                    <BranchesOutlined className='mr-1' />
                    Logic Rules
                  </Tag>
                }
              >
                <Alert
                  message='Define When This Workflow Should Run'
                  description='Create condition groups to specify exactly when this workflow should be triggered. Each group can contain multiple conditions, and you can combine groups with AND/OR logic.'
                  type='info'
                  showIcon
                  style={{ borderRadius: '8px', marginBottom: 10 }}
                />

                <ProFormList
                  name='conditionGroups'
                  creatorButtonProps={{
                    creatorButtonText: 'Add New Condition Group',
                    icon: <PlusOutlined />,
                    size: 'large',
                    variant: 'solid',
                    color: 'blue',
                  }}
                >
                  {(groupMeta, groupIndex) =>
                    renderConditionGroup(groupMeta, groupIndex)
                  }
                </ProFormList>
              </Card>
            )}

            {/* Actions Section */}
            <Card
              title={
                <div className='flex items-center'>
                  <PlayCircleOutlined className='mr-2 text-green-500' />
                  <span>Workflow Actions</span>
                </div>
              }
              className='shadow-sm'
              extra={
                <Tag color='green'>
                  <PlayCircleOutlined className='mr-1' />
                  Execute
                </Tag>
              }
            >
              <Alert
                message='Define What Happens When Conditions Are Met'
                description='Add actions that will be executed when your workflow conditions are satisfied. Actions can include field updates, notifications, integrations, and more.'
                type='success'
                showIcon
                style={{ marginBottom: 10 }}
              />

              <ProFormList
                name='actions'
                creatorButtonProps={{
                  creatorButtonText: 'Add New Action',
                  icon: <PlusOutlined />,
                  size: 'large',
                  variant: 'solid',
                  color: 'green',
                }}
                alwaysShowItemLabel={true}
              >
                {(meta, index) => renderAction(meta, index)}
              </ProFormList>
            </Card>
          </Space>
        </ProForm>
      </PageContainer>
    </>
  );
}
