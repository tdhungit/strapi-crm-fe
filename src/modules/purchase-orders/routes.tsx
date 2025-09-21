import PurchaseOrderForm from './PurchaseOrderForm';

const routes = [
  {
    path: '/collections/purchase-orders/create',
    element: <PurchaseOrderForm />,
  },
  {
    path: '/collections/purchase-orders/edit/:id',
    element: <PurchaseOrderForm />,
  },
];

export default routes;
