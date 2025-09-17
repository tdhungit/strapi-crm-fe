import { Navigate } from 'react-router-dom';
import UserDetail from './UserDetail';
import UserForm from './UserForm';
import UserList from './UserList';
import UserProfile from './UserProfile';

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
  {
    path: '/users/profile',
    element: <UserProfile />,
    name: 'Profile',
  },
  {
    path: '/collections/users/*',
    element: <Navigate to='/users' replace />,
  },
];

export default routes;
