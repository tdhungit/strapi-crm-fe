import { ShopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function CouponList() {
  return (
    <CollectionListComponent
      module='coupons'
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
