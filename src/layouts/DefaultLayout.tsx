import {
  FileTextOutlined,
  HomeOutlined,
  LockOutlined,
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
import ChangePasswordModal from '../modules/users/components/ChangePasswordModal';
import ApiService from '../services/ApiService';
import MenuService from '../services/MenuService';
import { setUserStore } from '../stores/authSlice';

const { Header, Content, Footer, Sider } = Layout;

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const dispatch = useDispatch();

  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  const { data: user } = useRequest(() =>
    ApiService.request('get', '/users/me')
  );

  useEffect(() => {
    if (user) {
      dispatch(setUserStore(user));
      setUserRole(user.role?.name || '');
    }
  }, [user, dispatch]);

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
        if (
          userRole !== 'Administrator' &&
          item.uid === 'api::setting.setting'
        ) {
          return;
        }

        const IconComponent = iconMap[item.icon] || FileTextOutlined;
        // let children: any;
        // if (item.children && item.children.length > 0) {
        //   children = item.children as any;
        // }
        items.push({
          key: item.key,
          icon: <IconComponent />,
          label: item.label,
          // children,
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
  }, [appSettings, userRole]);

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
        <div className='m-0 p-0 bg-transparent'>
          <a
            href='/home'
            className='block no-underline transition-all duration-300 ease-in-out h-16 hover:translate-y-[-1px] hover:shadow-[0_4px_15px_rgba(0,255,128,0.1)]'
          >
            <div
              className={`flex items-center transition-all duration-300 ease-in-out relative overflow-hidden h-16 ${
                collapsed
                  ? 'justify-center px-1.5 py-4 bg-transparent border-none backdrop-blur-none hover:bg-green-500/5 hover:rounded-lg'
                  : 'gap-3 px-4 py-3 bg-gradient-to-r from-green-900/10 to-green-800/10 border border-green-500/20 backdrop-blur-sm hover:shadow-[0_8px_25px_rgba(0,255,128,0.15)]'
              }`}
            >
              <div
                className={`flex-shrink-0 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 ${
                  collapsed
                    ? 'w-8 h-8 p-1 shadow-[0_2px_8px_rgba(0,255,128,0.2)] hover:shadow-[0_4px_12px_rgba(0,255,128,0.3)]'
                    : 'w-10 h-10 p-1.5 shadow-[0_4px_15px_rgba(0,255,128,0.3)] hover:shadow-[0_6px_20px_rgba(0,255,128,0.4)]'
                }`}
              >
                <img
                  src={
                    (appSettings?.logo?.menuLogo?.url &&
                      `${import.meta.env.VITE_STRAPI_URL}${
                        appSettings.logo.menuLogo.url
                      }`) ||
                    '/logo.svg'
                  }
                  alt={appSettings?.uiConfig?.pageTitle || 'Strapi CRM'}
                  className='w-full h-full object-contain rounded-md brightness-110 contrast-110'
                />
              </div>

              {!collapsed && (
                <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                  <strong className='text-lg font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent leading-tight tracking-tight m-0 -ml-[0.025em] shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
                    {appSettings?.uiConfig?.pageTitle || 'Strapi CRM'}
                  </strong>
                  <div className='text-[11px] font-medium text-white/70 leading-none tracking-[0.02em] uppercase opacity-80 transition-opacity duration-300 hover:opacity-100 hover:text-white/90'>
                    A Open Source CRM System
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
                  userRole === 'Administrator'
                    ? {
                        key: 'settings',
                        icon: <SettingOutlined />,
                        label: 'Settings',
                        onClick: () => navigate('/settings'),
                      }
                    : null,
                  {
                    type: 'divider',
                  },
                  {
                    key: 'change-password',
                    icon: <LockOutlined />,
                    label: 'Change Password',
                    onClick: () => setIsOpenChangePassword(true),
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
        <Footer className='bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] h-[48px] flex items-center justify-center p-0 mt-auto'>
          <div className='w-full h-[48px] flex justify-between items-center transition-all duration-200'>
            <div className='flex items-center ml-[-10px]'>
              <div className='flex flex-col gap-1'>
                <span className='text-gray-600 text-sm md:text-xs sm:text-xs font-medium leading-tight tracking-tight'>
                  Strapi CRM ©2025.
                </span>
                <span className='text-green-600 text-xs md:text-[10px] sm:text-[10px] font-medium tracking-wide'>
                  Powered by Jacky
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <span className='bg-gradient-to-r from-green-500 to-green-700 text-white px-2 py-1 md:px-1.5 md:py-0.5 sm:px-1.5 sm:py-0.5 rounded-xl text-xs md:text-[9px] sm:text-[9px] font-semibold uppercase tracking-wider shadow-[0_1px_4px_rgba(0,204,102,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_8px_rgba(0,204,102,0.4)] relative overflow-hidden'>
                v1.0.0
              </span>
            </div>
          </div>
        </Footer>
      </Layout>

      <ChangePasswordModal
        open={isOpenChangePassword}
        onOpenChange={setIsOpenChangePassword}
      />
    </Layout>
  );
}
