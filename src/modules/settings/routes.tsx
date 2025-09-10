import MenuSettings from './MenuSettings';
import ModuleWidgetSettings from './ModuleWidgetSettings';
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
  {
    path: '/settings/module-widgets',
    element: <ModuleWidgetSettings />,
    name: 'Widget Settings',
  },
];

export default routes;
