import POS from './POS';
import SaleOrderDetail from './SaleOrderDetail';
import SaleOrderForm from './SaleOrderForm';
import SaleOrderList from './SaleOrderList';

const routes = [
  {
    path: '/collections/sale-orders',
    element: <SaleOrderList />,
  },
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
  {
    path: '/pos',
    element: <POS />,
    layout: 'empty',
  },
];

export default routes;
