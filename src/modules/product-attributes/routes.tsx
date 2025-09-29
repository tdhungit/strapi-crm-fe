import ProductAttributeForm from './ProductAttributeForm';
import ProductAttributeList from './ProductAttributeList';

const routes = [
  {
    path: '/collections/product-attributes',
    element: <ProductAttributeList />,
    name: 'Product Attributes',
  },
  {
    path: '/collections/product-attributes/create',
    element: <ProductAttributeForm />,
    name: 'Product Attribute Create',
  },
  {
    path: '/collections/product-attributes/edit/:id',
    element: <ProductAttributeForm />,
    name: 'Product Attribute Edit',
  },
  {
    path: '/collections/product-attributes/detail/:id',
    element: <ProductAttributeForm />,
    name: 'Product Attribute Detail',
  },
];

export default routes;
