import { FundViewOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function ProductList() {
  const navigate = useNavigate();

  return (
    <CollectionListComponent
      module='products'
      extra={[
        <Button
          type='primary'
          key='product-prices'
          onClick={() => navigate('/collections/products/prices')}
        >
          <FundViewOutlined /> Product Prices
        </Button>,
      ]}
    />
  );
}
