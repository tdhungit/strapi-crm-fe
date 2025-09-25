import PurchaseOrderDetail from './PurchaseOrderDetail';
import PurchaseOrderForm from './PurchaseOrderForm';
import PurchaseOrderList from './PurchaseOrderList';

const routes = [
  {
    path: '/collections/purchase-orders',
    element: <PurchaseOrderList />,
  },
  {
    path: '/collections/purchase-orders/create',
    element: <PurchaseOrderForm />,
  },
  {
    path: '/collections/purchase-orders/edit/:id',
    element: <PurchaseOrderForm />,
  },
  {
    path: '/collections/purchase-orders/detail/:id',
    element: <PurchaseOrderDetail />,
  },
];

export default routes;
