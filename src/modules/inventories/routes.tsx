import InventoryDetail from './InventoryDetail';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';
import InventoryManuals from './InventoryManuals';
import InventoryManualDetail from './widgets/InventoryManualDetail';

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
  {
    path: '/collections/inventories/manuals/detail/:id',
    element: <InventoryManualDetail />,
  },
];

export default routes;
