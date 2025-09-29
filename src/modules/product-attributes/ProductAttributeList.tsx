import { AppstoreOutlined, FundViewOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function ProductAttributeList() {
  const navigate = useNavigate();

  return (
    <CollectionListComponent
      module='product-attributes'
      header={{
        title: 'Product Attributes',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Products',
              href: '/collections/products',
            },
            {
              title: 'Product Attributes',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
      extra={[
        <Button
          variant='solid'
          color='blue'
          key='products'
          onClick={() => navigate('/collections/products')}
        >
          <AppstoreOutlined /> Products
        </Button>,
        <Button
          variant='solid'
          color='blue'
          key='product-categories'
          onClick={() => navigate('/collections/product-categories')}
        >
          <AppstoreOutlined /> Categories
        </Button>,
        <Button
          variant='solid'
          color='blue'
          key='product-prices'
          onClick={() => navigate('/collections/products/prices')}
        >
          <FundViewOutlined /> Prices
        </Button>,
      ]}
    />
  );
}
