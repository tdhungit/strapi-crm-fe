import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns: ColumnsType<any> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await ApiService.getClient().collection('users').find();
        setUsers(users);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User List</h1>
      <Table dataSource={users} columns={columns} rowKey='id' pagination={false} />
    </div>
  );
};

export default UserList;
