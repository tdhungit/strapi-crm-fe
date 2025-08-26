import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Form } from 'antd';
import { useEffect } from 'react';
import PageLoading from '../../components/PageLoading';
import ApiService from '../../services/ApiService';

export default function UserProfile() {
  const [form] = Form.useForm();

  const { data: user } = useRequest(() => ApiService.request('get', '/users/me'));

  useEffect(() => {
    if (form && user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  if (!user) {
    return <PageLoading />;
  }

  return (
    <div className='w-full'>
      <h1 className='text-2xl font-bold'>User Profile</h1>

      <div className='mt-4 bg-white rounded-lg shadow-md p-4'>
        <ProForm layout='vertical' form={form}>
          <ProForm.Group>
            <ProFormText name='username' label='Username' disabled width={'md'} />
            <ProFormText name='email' label='Email' disabled width={'md'} />
          </ProForm.Group>
        </ProForm>
      </div>
    </div>
  );
}
