import InventoryDetail from './InventoryDetail';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';

const routes = [
  {
    path: '/collections/inventories',
    element: <InventoryList />,
  },
  {
    path: '/collections/inventories/create',
    element: <InventoryForm />,
  },
  {
    path: '/collections/inventories/edit/:id',
    element: <InventoryForm />,
  },
  {
    path: '/collections/inventories/detail/:id',
    element: <InventoryDetail />,
  },
];

export default routes;
