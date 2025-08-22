import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import DefaultLayout from './layouts/DefaultLayout';
import Login from './modules/authenticates/Login';
import CollectionRoutes from './modules/collections/CollectionRoutes';
import IndexRoutes from './modules/index/IndexRoutes';
import SettingRoutes from './modules/settings/SettingRoutes';
import UserRoutes from './modules/users/UserRoutes';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        {IndexRoutes()}
        {CollectionRoutes()}
        {UserRoutes()}
        {SettingRoutes()}
      </Route>
      {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
    </Routes>
  );
}
