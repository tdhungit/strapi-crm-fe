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
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { iconMap } from '../config/icons';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/ApiService';
import MenuService from '../services/MenuService';
import { setUserStore } from '../stores/authSlice';

const { Header, Content, Footer, Sider } = Layout;

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const dispatch = useDispatch();

  const { data: user } = useRequest(() =>
    ApiService.request('get', '/users/me')
  );

  useEffect(() => {
    if (user) {
      dispatch(setUserStore(user));
    }
  }, [user, dispatch]);

  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const { data: appSettings } = useRequest(() => {
    return MenuService.getAppSettings();
  });

  useEffect(() => {
    // update menu
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
    // update favicon
    if (appSettings?.uiConfig?.favicon) {
      let link: any = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = appSettings.uiConfig.favicon;
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
          <a href='/home' className='logo-link'>
            <div className='logo-container'>
              <div className='logo-image-wrapper'>
                <img
                  src={
                    (appSettings?.logo?.menuLogo?.url &&
                      `${import.meta.env.VITE_STRAPI_URL}${
                        appSettings.logo.menuLogo.url
                      }`) ||
                    '/logo.svg'
                  }
                  alt='StrapiCRM'
                  className='logo-image'
                />
              </div>

              {!collapsed && (
                <div className='logo-text-wrapper'>
                  <strong className='logo-text'>
                    {appSettings?.uiConfig?.pageTitle || 'StrapiCRM'}
                  </strong>
                  <div className='logo-subtitle'>
                    {appSettings?.uiConfig?.pageSubtitle || 'A Open Source CRM'}
                  </div>
                </div>
              )}
            </div>
          </a>
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          mode='inline'
          items={menuItems}
          onClick={(item: any) => navigate(item.key, { replace: true })}
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
        <Content>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Strapi CRM ©2025. Power by Jacky
        </Footer>
      </Layout>
    </Layout>
  );
}
