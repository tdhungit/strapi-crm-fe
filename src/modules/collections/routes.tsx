import CollectionDetail from './CollectionDetail';
import CollectionForm from './CollectionForm';
import CollectionList from './CollectionList';
import CollectionProfile from './CollectionProfile';

const routes = [
  {
    path: '/collections/:name',
    element: <CollectionList />,
    name: 'Collection List',
  },
  {
    path: '/collections/:name/create',
    element: <CollectionForm />,
    name: 'Collection Form',
  },
  {
    path: '/collections/:name/detail/:id',
    element: <CollectionDetail />,
    name: 'Collection Detail',
  },
  {
    path: '/collections/:name/profile/:id',
    element: <CollectionProfile />,
    name: 'Collection Profile',
  },
  {
    path: '/collections/:name/edit/:id',
    element: <CollectionForm />,
    name: 'Collection Edit',
  },
];

export default routes;
