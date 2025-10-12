import CouponDetail from './CouponDetail';
import CouponList from './CouponList';

const routes = [
  {
    path: '/collections/coupons',
    element: <CouponList />,
  },
  {
    path: '/collections/coupons/detail/:id',
    element: <CouponDetail />,
  },
];

export default routes;
