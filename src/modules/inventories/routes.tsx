import InventoryDetail from './InventoryDetail';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';
import InventoryManuals from './InventoryManuals';

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
  {
    path: '/collections/inventories/manuals',
    element: <InventoryManuals />,
  },
];

export default routes;
