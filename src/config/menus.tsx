export const defaultMenus: any = {
  users: {
    key: '_users',
    icon: 'users',
    label: 'Users',
    children: [
      {
        key: '/users',
        label: 'User List',
      },
      {
        key: '/users/create',
        label: 'Create User',
      },
    ],
  },
  settings: {
    key: '_settings',
    label: 'Settings',
    icon: 'setting',
    children: [
      {
        key: '/settings',
        label: 'General Settings',
      },
      {
        key: '/settings/menus',
        label: 'Menu Settings',
      },
    ],
  },
};
