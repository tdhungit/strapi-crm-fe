import { FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconMap } from '../../config/icons';

export default function MainMenu({ appSettings, user }: any) {
  const userRole = user?.role?.name || 'Guest';

  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<any[]>([]);

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
  }, [appSettings]);

  return (
    <Menu
      defaultSelectedKeys={['1']}
      mode='inline'
      items={menuItems}
      onClick={(item: any) => navigate(item.key, { replace: true })}
      style={{
        background: '#003300',
        color: '#ffffff',
        border: 'none',
      }}
      theme='dark'
      className='custom-menu'
    />
  );
}
