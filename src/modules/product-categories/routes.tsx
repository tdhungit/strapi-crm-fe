import ProductCategoryList from './ProductCategoryList';
import ProductCategoryTree from './ProductCategoryTree';

const routes = [
  {
    path: '/collections/product-categories',
    element: <ProductCategoryList />,
    name: 'Product Categories',
  },
  {
    path: '/collections/product-categories/tree',
    element: <ProductCategoryTree />,
    name: 'Product Categories',
  },
];

export default routes;
