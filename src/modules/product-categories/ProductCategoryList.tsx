import {
  AppstoreOutlined,
  FundViewOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import CollectionListComponent from '../collections/components/CollectionListComponent';
import ProductCategoryDrawer from './components/ProductCategoryDrawer';

export default function ProductCategoryList() {
  const navigate = useNavigate();

  return (
    <CollectionListComponent
      module='product-categories'
      header={{
        title: 'Product Categories',
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
              title: 'Product Categories',
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
          key='product-attributes'
          onClick={() => navigate('/collections/product-attributes')}
        >
          <TagOutlined /> Attributes
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
      drawerComponent={ProductCategoryDrawer}
    />
  );
}
