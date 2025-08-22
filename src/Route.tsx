import { Navigate, Route, Routes } from 'react-router-dom';
import routes from './config/routes';
import { useAuth } from './hooks/useAuth';
import DefaultLayout from './layouts/DefaultLayout';
import Login from './modules/authenticates/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

console.log({ routes });

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
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
      {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
    </Routes>
  );
}
