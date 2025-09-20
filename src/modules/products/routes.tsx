import ProductDetail from './ProductDetail';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductPriceList from './ProductPriceList';

const routes = [
  {
    path: '/collections/products',
    element: <ProductList />,
  },
  {
    path: '/collections/products/create',
    element: <ProductForm />,
  },
  {
    path: '/collections/products/edit/:id',
    element: <ProductForm />,
  },
  {
    path: '/collections/products/detail/:id',
    element: <ProductDetail />,
  },
  {
    path: '/collections/products/prices',
    element: <ProductPriceList />,
  },
];

export default routes;
