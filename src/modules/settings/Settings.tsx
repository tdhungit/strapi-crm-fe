import {
  AppstoreOutlined,
  MenuOutlined,
  RightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { Avatar, Card, Col, Divider, Row, Space } from 'antd/lib';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function Settings() {
  const navigate = useNavigate();

  const settingsData = [
    {
      title: 'Menu Settings',
      description:
        'Configure and organize your navigation menu items. Drag and drop to reorder, show or hide menu items.',
      icon: <MenuOutlined />,
      link: '/settings/menus',
      color: '#1890ff',
      category: 'Interface',
    },
    {
      title: 'Widget Settings',
      description:
        'Manage dashboard widgets and module configurations. Customize your workspace layout.',
      icon: <SettingOutlined />,
      link: '/settings/module-widgets',
      color: '#52c41a',
      category: 'Dashboard',
    },
  ];

  const categories = [...new Set(settingsData.map((item) => item.category))];

  const handleSettingClick = (link: string) => {
    navigate(link);
  };

  return (
    <PageContainer
      header={{
        title: (
          <Space align='center'>
            <Avatar
              size='large'
              icon={<AppstoreOutlined />}
              style={{ backgroundColor: '#722ed1' }}
            />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Settings
              </Title>
              <Text type='secondary'>
                Configure your application preferences and settings
              </Text>
            </div>
          </Space>
        ),
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
          ],
        },
      }}
      content={
        <Text type='secondary'>
          Manage your application settings, customize your workspace, and
          configure system preferences.
        </Text>
      }
    >
      <div className='mt-6'>
        {categories.map((category, categoryIndex) => (
          <div key={category} className='mb-8'>
            <Title level={4} className='mb-4 text-gray-700'>
              {category} Settings
            </Title>

            <Row gutter={[24, 24]}>
              {settingsData
                .filter((item) => item.category === category)
                .map((item) => (
                  <Col xs={24} sm={12} lg={8} key={item.link}>
                    <Card
                      hoverable
                      className='h-full transition-all duration-300 hover:shadow-lg border-0 shadow-sm'
                      onClick={() => handleSettingClick(item.link)}
                      style={{
                        borderLeft: `4px solid ${item.color}`,
                        cursor: 'pointer',
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <Space align='start' size='middle'>
                            <Avatar
                              size={48}
                              icon={item.icon}
                              style={{
                                backgroundColor: item.color,
                                fontSize: '20px',
                              }}
                            />
                            <div className='flex-1'>
                              <Title level={5} className='mb-2 text-gray-800'>
                                {item.title}
                              </Title>
                              <Text
                                type='secondary'
                                className='text-sm leading-relaxed'
                              >
                                {item.description}
                              </Text>
                            </div>
                          </Space>
                        </div>
                        <RightOutlined className='text-gray-400 ml-3 transition-transform duration-200 group-hover:translate-x-1' />
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>

            {categoryIndex < categories.length - 1 && (
              <Divider className='my-8' />
            )}
          </div>
        ))}

        <Card
          className='mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          bodyStyle={{ padding: '24px' }}
        >
          <div className='text-center'>
            <Avatar
              size={64}
              icon={<AppstoreOutlined />}
              className='mb-4'
              style={{ backgroundColor: '#1890ff' }}
            />
            <Title level={4} className='mb-2'>
              Need More Settings?
            </Title>
            <Text type='secondary' className='text-base'>
              More configuration options and advanced settings will be available
              in future updates.
              <br />
              Contact support if you need specific customization options.
            </Text>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
