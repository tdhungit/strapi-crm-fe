import UserDetail from './UserDetail';
import UserForm from './UserForm';
import UserList from './UserList';

const routes = [
  {
    path: '/users',
    element: <UserList />,
    name: 'Users',
  },
  {
    path: '/users/create',
    element: <UserForm />,
    name: 'Create User',
  },
  {
    path: '/users/edit/:id',
    element: <UserForm />,
    name: 'Edit User',
  },
  {
    path: '/users/detail/:id',
    element: <UserDetail />,
    name: 'User Detail',
  },
];

export default routes;
