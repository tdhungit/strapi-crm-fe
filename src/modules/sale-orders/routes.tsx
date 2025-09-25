import SaleOrderDetail from './SaleOrderDetail';
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
  {
    path: '/collections/sale-orders/detail/:id',
    element: <SaleOrderDetail />,
  },
];

export default routes;
