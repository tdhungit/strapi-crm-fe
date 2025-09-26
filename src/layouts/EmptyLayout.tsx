import { useRequest } from 'ahooks';
import { Layout } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import ApiService from '../services/ApiService';
import { setUserStore } from '../stores/authSlice';

export default function EmptyLayout() {
  const dispatch = useDispatch();

  const { data: user } = useRequest(() =>
    ApiService.request('get', '/users/me')
  );

  useEffect(() => {
    if (user) {
      dispatch(setUserStore(user));
    }
  }, [user, dispatch]);

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Outlet />
    </Layout>
  );
}
