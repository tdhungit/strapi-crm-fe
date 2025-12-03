import { ShopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function CouponList() {
  return (
    <CollectionListComponent
      module='coupons'
      header={{
        title: 'Coupons',
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: 'Home',
            },
            {
              path: '/collections/sale-orders',
              breadcrumbName: 'Sale Orders',
            },
            {
              breadcrumbName: 'Coupons',
            },
          ],
        },
      }}
      extra={[
        <Link
          to='/collections/sale-orders'
          className='inline-block'
          key='sale-orders'
        >
          <Button type='primary'>
            <ShopOutlined /> Sale Orders
          </Button>
        </Link>,
      ]}
    />
  );
}
