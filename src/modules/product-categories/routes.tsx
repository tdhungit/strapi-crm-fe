import ProductCategoryDetail from './ProductCategoryDetail';
import ProductCategoryForm from './ProductCategoryForm';
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
  {
    path: '/collections/product-categories/detail/:id',
    element: <ProductCategoryDetail />,
    name: 'Product Categories',
  },
  {
    path: '/collections/product-categories/edit/:id',
    element: <ProductCategoryForm />,
    name: 'Product Categories',
  },
  {
    path: '/collections/product-categories/create',
    element: <ProductCategoryForm />,
    name: 'Product Categories',
  },
];

export default routes;
