import ProductDetail from './ProductDetail';
import ProductForm from './ProductForm';

const routes = [
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
];

export default routes;
