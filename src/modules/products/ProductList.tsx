import {
  AppstoreOutlined,
  FundViewOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';
import ProductDetailDrawer from './components/ProductDetailDrawer';

export default function ProductList() {
  const navigate = useNavigate();

  return (
    <CollectionListComponent
      module='products'
      extra={[
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
      drawerComponent={ProductDetailDrawer}
    />
  );
}
