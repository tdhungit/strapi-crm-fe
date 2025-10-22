import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Layout, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import PageLoading from '../components/PageLoading';
import ApiService from '../services/ApiService';
import MenuService from '../services/MenuService';
import { setUserStore } from '../stores/authSlice';
import MainFooter from './components/MainFooter';
import MainLogo from './components/MainLogo';
import MainMenu from './components/MainMenu';
import UserDropdown from './components/UserDropdown';
import UserNotification from './components/UserNotification';

const { Header, Content, Sider } = Layout;

export default function DefaultLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);
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

  if (!user) {
    return <PageLoading />;
  }

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
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {user && (
          <MainLogo
            appSettings={appSettings}
            user={user}
            collapsed={collapsed}
          />
        )}

        <div
          style={{
            height: 'calc(100vh - 111px)', // Subtract header height
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {user && <MainMenu appSettings={appSettings} user={user} />}
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 60 : 260,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            padding: 0,
            background: 'rgb(255, 255, 255)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
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
            <Button
              type='text'
              icon={<QrcodeOutlined />}
              onClick={() => navigate('/pos')}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            >
              POS
            </Button>
          </div>

          <div style={{ marginRight: 16 }}>
            <Space>
              {user && <UserNotification user={user} />}
              {user && <UserDropdown user={user} />}
            </Space>
          </div>
        </Header>

        <Content>
          <Outlet />
        </Content>

        <MainFooter />
      </Layout>
    </Layout>
  );
}
