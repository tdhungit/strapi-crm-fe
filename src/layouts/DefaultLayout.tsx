import {
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { iconMap } from '../config/icons';
import MenuService from '../services/MenuService';

const { Header, Content, Footer, Sider } = Layout;

export default function DefaultLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const { data: mainMenus } = useRequest(() => {
    return MenuService.getMenuItems();
  });

  console.log(mainMenus);

  useEffect(() => {
    if (mainMenus && mainMenus.length > 0) {
      const items: any[] = [
        {
          key: 'home',
          icon: <HomeOutlined />,
          label: 'Home',
        },
      ];
      mainMenus.forEach((item: any) => {
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
  }, [mainMenus]);

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        collapsedWidth={60}
        theme='light'
      >
        <div className='demo-logo-vertical' />
        <Menu
          theme='light'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={menuItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: 'rgb(255, 255, 255)' }}>
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
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Strapi CRM ©2025. Power by Jacky</Footer>
      </Layout>
    </Layout>
  );
}
