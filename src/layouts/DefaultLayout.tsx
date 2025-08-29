import {
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Dropdown, Layout, Menu, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { iconMap } from '../config/icons';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/ApiService';
import MenuService from '../services/MenuService';

const { Header, Content, Footer, Sider } = Layout;

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: user } = useRequest(() =>
    ApiService.request('get', '/users/me')
  );

  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const { data: appSettings } = useRequest(() => {
    return MenuService.getAppSettings();
  });

  useEffect(() => {
    if (appSettings?.menus && appSettings?.menus.length > 0) {
      const items: any[] = [
        {
          key: 'home',
          icon: <HomeOutlined />,
          label: 'Home',
        },
      ];
      appSettings.menus.forEach((item: any) => {
        const IconComponent = iconMap[item.icon] || FileTextOutlined;
        let children: any;
        if (item.children && item.children.length > 0) {
          children = item.children as any;
        }
        items.push({
          key: item.key,
          icon: <IconComponent />,
          label: item.label,
          children,
        });
      });

      // Set the menu items state
      setMenuItems(items);
    }
  }, [appSettings]);

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        collapsedWidth={60}
        style={{
          background: '#003300',
        }}
      >
        <div className='logo-vertical'>
          <a href='/home' className='flex items-start gap-2'>
            {appSettings?.logo?.menuLogo?.url && (
              <img
                src={
                  import.meta.env.VITE_STRAPI_URL +
                  appSettings.logo.menuLogo.url
                }
                alt='StrapiCRM'
                className='max-h-[32px]'
              />
            )}
            {!collapsed && (
              <strong className='text-xl font-bold'>
                {appSettings?.uiConfig?.pageTitle || 'StrapiCRM'}
              </strong>
            )}
          </a>
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          mode='inline'
          items={menuItems}
          onClick={(item: any) => navigate(item.key)}
          style={{
            background: '#003300',
            color: '#ffffff',
          }}
          theme='dark'
          className='custom-menu'
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: 'rgb(255, 255, 255)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginRight: 16 }}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Profile',
                    onClick: () => navigate('/users/profile'),
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: 'Settings',
                    onClick: () => navigate('/settings'),
                  },
                  {
                    key: 'menu-settings',
                    icon: <SettingOutlined />,
                    label: 'Menu Settings',
                    onClick: () => navigate('/settings/menus'),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: () => {
                      logout();
                      navigate('/login');
                    },
                  },
                ],
              }}
              placement='bottomRight'
              trigger={['click']}
            >
              <Button
                type='text'
                icon={<UserOutlined />}
                style={{
                  fontSize: '16px',
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Space>{user?.username || '...'}</Space>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Strapi CRM ©2025. Power by Jacky
        </Footer>
      </Layout>
    </Layout>
  );
}
