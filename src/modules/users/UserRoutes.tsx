import { Route } from 'react-router-dom';
import UserForm from './UserForm';
import UserList from './UserList';

export default function UserRoutes() {
  return (
    <>
      <Route path='/users' element={<UserList />} />
      <Route path='/users/create' element={<UserForm />} />
      <Route path='/users/:id' element={<UserForm />} />
    </>
  );
}
