import { Navigate, Route, Routes } from 'react-router-dom';
import routes from './config/routes';
import { useAuth } from './hooks/useAuth';
import DefaultLayout from './layouts/DefaultLayout';
import EmptyLayout from './layouts/EmptyLayout';
import Login from './modules/authenticates/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  const defaultLayouts: React.ReactNode[] = [];
  const emptyLayouts: React.ReactNode[] = [];
  routes.forEach((route) => {
    if (route.layout === 'empty') {
      emptyLayouts.push(
        <Route key={route.path} path={route.path} element={route.element} />
      );
    } else {
      defaultLayouts.push(
        <Route key={route.path} path={route.path} element={route.element} />
      );
    }
  });

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
        {defaultLayouts}
      </Route>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <EmptyLayout />
          </ProtectedRoute>
        }
      >
        {emptyLayouts}
      </Route>
      {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
    </Routes>
  );
}
