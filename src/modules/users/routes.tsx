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
    path: '/users/:id',
    element: <UserForm />,
    name: 'Edit User',
  },
];

export default routes;
