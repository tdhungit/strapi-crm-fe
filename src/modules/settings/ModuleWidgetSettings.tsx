import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DragOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { camelToTitle } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';
import { getWidgets } from '../collections/widgets';

const { Text } = Typography;
const { Option } = Select;

interface WidgetItem {
  id: string;
  name: string;
  component: React.FC;
}

export default function ModuleWidgetSettings() {
  const contentTypes = MetadataService.getSavedContentTypes();
  const crmContentTypes = contentTypes.filter((ct) => ct.isCRM);

  const [selectedModule, setSelectedModule] = useState<string>('');
  const [allWidgets, setAllWidgets] = useState<WidgetItem[]>([]);
  const [displayedWidgets, setDisplayedWidgets] = useState<WidgetItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<WidgetItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification } = App.useApp();

  useEffect(() => {
    if (selectedModule) {
      loadModuleWidgets();
    } else {
      setAllWidgets([]);
      setDisplayedWidgets([]);
    }
  }, [selectedModule]);

  const loadModuleWidgets = async () => {
    const moduleWidgets = getWidgets(selectedModule);
    const widgetItems: WidgetItem[] = Object.entries(moduleWidgets).map(
      ([key, component]) => ({
        id: key,
        name: key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to readable name
        component,
      })
    );

    // Load current settings
    await getCurrentSettings(widgetItems);
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
  };

  const handleDragStart = (e: React.DragEvent, item: WidgetItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToDisplayed = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && !displayedWidgets.find((w) => w.id === draggedItem.id)) {
      setDisplayedWidgets((prev) => [...prev, draggedItem]);
      setAllWidgets((prev) => prev.filter((w) => w.id !== draggedItem.id));
    }
    setDraggedItem(null);
  };

  const handleDropToAll = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && !allWidgets.find((w) => w.id === draggedItem.id)) {
      setAllWidgets((prev) => [...prev, draggedItem]);
      setDisplayedWidgets((prev) =>
        prev.filter((w) => w.id !== draggedItem.id)
      );
    }
    setDraggedItem(null);
  };

  const moveToDisplayed = (widget: WidgetItem) => {
    if (!displayedWidgets.find((w) => w.id === widget.id)) {
      setDisplayedWidgets((prev) => [...prev, widget]);
      setAllWidgets((prev) => prev.filter((w) => w.id !== widget.id));
    }
  };

  const moveToAll = (widget: WidgetItem) => {
    if (!allWidgets.find((w) => w.id === widget.id)) {
      setAllWidgets((prev) => [...prev, widget]);
      setDisplayedWidgets((prev) => prev.filter((w) => w.id !== widget.id));
    }
  };

  const getCurrentSettings = async (allWidgetItems: WidgetItem[]) => {
    try {
      setLoading(true);
      const response = await ApiService.request('get', `/settings/user`, {
        name: 'widgets',
      });

      const savedSettings = response?.widgets || {};
      const moduleSettings = savedSettings[selectedModule] || [];

      // Split widgets based on saved settings
      const displayed: WidgetItem[] = [];
      const available: WidgetItem[] = [];

      allWidgetItems.forEach((widget) => {
        if (moduleSettings.includes(widget.id)) {
          displayed.push(widget);
        } else {
          available.push(widget);
        }
      });

      // Maintain order from saved settings for displayed widgets
      const orderedDisplayed = moduleSettings
        .map((id: string) => displayed.find((w) => w.id === id))
        .filter(Boolean);

      setDisplayedWidgets(orderedDisplayed);
      setAllWidgets(available);
    } catch (error) {
      console.error('Failed to load widget settings:', error);
      // If loading fails, show all widgets as available
      setAllWidgets(allWidgetItems);
      setDisplayedWidgets([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);

      // Get current settings first
      let currentSettings = {};
      try {
        const response = await ApiService.request('get', `/settings/user`, {
          name: 'widgets',
        });
        currentSettings = response?.data?.value || {};
      } catch (error) {
        console.error('Failed to fetch current settings:', error);
        // If no settings exist yet, start with empty object
        currentSettings = {};

        notification.error({
          message: 'Failed to fetch current settings',
        });
      }

      // Update settings for current module
      const updatedSettings = {
        ...currentSettings,
        [selectedModule]: displayedWidgets.map((w) => w.id),
      };

      await ApiService.request('put', '/settings/user', {
        widgets: updatedSettings,
      });

      // Reload current settings to ensure consistency
      const moduleWidgets = getWidgets(selectedModule);
      const widgetItems: WidgetItem[] = Object.entries(moduleWidgets).map(
        ([key, component]) => ({
          id: key,
          name: key.replace(/([A-Z])/g, ' $1').trim(),
          component,
        })
      );

      await getCurrentSettings(widgetItems);

      notification.success({
        message: 'Widget settings saved successfully',
      });

      // You could add a success message here
      console.log('Widget settings saved successfully');
    } catch (error) {
      notification.error({
        message: 'Failed to save widget settings',
      });

      console.error('Failed to save widget settings:', error);
      // You could add error handling/notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: 'Widget Settings',
        subTitle: 'Configure dashboard widgets for your CRM modules',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Settings',
              href: '/settings',
            },
            {
              title: 'Widget Settings',
              href: '/settings/module-widgets',
            },
          ],
        },
      }}
      content={
        <div>
          <Text type='secondary'>
            Select a CRM module and configure which widgets should be displayed
            on its dashboard. Drag and drop widgets between the available and
            displayed lists to customize your layout.
          </Text>
        </div>
      }
    >
      {/* Module Selection */}
      <Card
        className='mb-6'
        styles={{
          body: {
            padding: 20,
          },
        }}
      >
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              <SettingOutlined className='mr-2' />
              Select CRM Module
            </Text>
            <Select
              placeholder='Choose a module to configure...'
              value={selectedModule || undefined}
              onChange={handleModuleChange}
              style={{ width: 300 }}
              allowClear
              size='large'
            >
              {crmContentTypes.map((contentType) => (
                <Option key={contentType.uid} value={contentType.pluralName}>
                  {contentType.displayName}
                </Option>
              ))}
            </Select>
          </div>

          {selectedModule && (
            <div className='bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400'>
              <Text type='secondary'>
                Configuring widgets for module:{' '}
                <Text strong className='text-blue-600'>
                  {camelToTitle(selectedModule)}
                </Text>
              </Text>
            </div>
          )}
        </Space>
      </Card>

      {selectedModule ? (
        <Row gutter={24} className='mt-2'>
          {/* Available Widgets List */}
          <Col xs={24} lg={12}>
            <Card title='Available Widgets' style={{ height: 500 }}>
              <div
                style={{
                  minHeight: 400,
                  border: '2px dashed #d9d9d9',
                  borderRadius: 6,
                  padding: 16,
                  backgroundColor: '#fafafa',
                }}
                onDragOver={handleDragOver}
                onDrop={handleDropToAll}
              >
                {allWidgets.length === 0 ? (
                  <Empty
                    description='No available widgets'
                    style={{ marginTop: 100 }}
                  />
                ) : (
                  <List
                    dataSource={allWidgets}
                    renderItem={(widget) => (
                      <List.Item
                        key={widget.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, widget)}
                        style={{
                          backgroundColor: 'white',
                          marginBottom: 8,
                          padding: '7px 12px',
                          borderRadius: 6,
                          border: '1px solid #d9d9d9',
                          cursor: 'move',
                          transition: 'box-shadow 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            '0 2px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        actions={[
                          <Button
                            key='add'
                            type='link'
                            icon={<ArrowRightOutlined />}
                            onClick={() => moveToDisplayed(widget)}
                          >
                            Add
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<DragOutlined style={{ color: '#8c8c8c' }} />}
                          title={widget.name}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </Card>
          </Col>

          {/* Displayed Widgets List */}
          <Col xs={24} lg={12}>
            <Card title='Displayed Widgets' style={{ height: 500 }}>
              <div
                style={{
                  minHeight: 400,
                  border: '2px dashed #52c41a',
                  borderRadius: 6,
                  padding: 16,
                  backgroundColor: '#f6ffed',
                }}
                onDragOver={handleDragOver}
                onDrop={handleDropToDisplayed}
              >
                {displayedWidgets.length === 0 ? (
                  <Empty
                    description='Drag widgets here to display them'
                    style={{ marginTop: 100 }}
                  />
                ) : (
                  <List
                    dataSource={displayedWidgets}
                    renderItem={(widget) => (
                      <List.Item
                        key={widget.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, widget)}
                        style={{
                          backgroundColor: 'white',
                          marginBottom: 8,
                          padding: '7px 12px',
                          borderRadius: 6,
                          border: '1px solid #d9d9d9',
                          cursor: 'move',
                          transition: 'box-shadow 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            '0 2px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        actions={[
                          <Button
                            key='remove'
                            type='link'
                            danger
                            icon={<ArrowLeftOutlined />}
                            onClick={() => moveToAll(widget)}
                          >
                            Remove
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<DragOutlined style={{ color: '#8c8c8c' }} />}
                          title={widget.name}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <Empty
          description='Please select a CRM module to configure its widgets'
          style={{ marginTop: 60 }}
        />
      )}

      {/* Action Buttons */}
      {selectedModule && (
        <Card
          className='mt-6'
          styles={{
            body: {
              padding: 20,
            },
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type='primary'
                onClick={saveSettings}
                loading={loading}
                disabled={loading}
              >
                Save Configuration
              </Button>
            </Space>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
