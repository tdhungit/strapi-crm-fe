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
];

export default routes;
