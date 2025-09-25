import InventoryDetail from './InventoryDetail';
import InventoryList from './InventoryList';

const routes = [
  {
    path: '/collections/inventories',
    element: <InventoryList />,
  },
  {
    path: '/collections/inventories/create',
    element: <InventoryList />,
  },
  {
    path: '/collections/inventories/edit/:id',
    element: <InventoryDetail />,
  },
  {
    path: '/collections/inventories/detail/:id',
    element: <InventoryDetail />,
  },
];

export default routes;
