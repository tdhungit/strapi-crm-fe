import {
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ChangePasswordModal from '../../modules/users/components/ChangePasswordModal';

export default function UserDropdown({ user }: { user: any }) {
  const userRole = user.role?.name || '';

  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  return (
    <>
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
      <ChangePasswordModal
        open={isOpenChangePassword}
        onOpenChange={setIsOpenChangePassword}
      />
    </>
  );
}
