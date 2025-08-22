import MenuSettings from './MenuSettings';
import Settings from './Settings';

const routes = [
  {
    path: '/settings',
    element: <Settings />,
    name: 'Settings',
  },
  {
    path: '/settings/menus',
    element: <MenuSettings />,
    name: 'Menu Settings',
  },
];

export default routes;
