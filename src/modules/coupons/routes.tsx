import CouponDetail from './CouponDetail';
import CouponForm from './CouponForm';
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
  {
    path: '/collections/coupons/create',
    element: <CouponForm />,
  },
  {
    path: '/collections/coupons/edit/:id',
    element: <CouponForm />,
  },
];

export default routes;
