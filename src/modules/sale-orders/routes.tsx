import SaleOrderForm from './SaleOrderForm';

const routes = [
  {
    path: '/collections/sale-orders/create',
    element: <SaleOrderForm />,
  },
  {
    path: '/collections/sale-orders/edit/:id',
    element: <SaleOrderForm />,
  },
];

export default routes;
