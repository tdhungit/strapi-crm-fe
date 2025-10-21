import {
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiService from '../../../services/ApiService';
import type { RootState } from '../../../stores';

export default function AddDashboardModal({
  open,
  onOpenChange,
  id,
  onFinish,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  onFinish: (dashboard: any) => void;
}) {
  const { message } = App.useApp();
  const [form] = ProForm.useForm();

  const user = useSelector((state: RootState) => state.auth.user);

  const [dashboard, setDashboard] = useState<any>({});

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('dashboards')
        .findOne(id)
        .then((res) => {
          setDashboard(res.data);
        });
    }
  }, [id]);

  useEffect(() => {
    if (dashboard?.id) {
      form.setFieldsValue({
        name: dashboard.name,
        is_default: dashboard.is_default || false,
      });
    }
  }, [dashboard]);

  const handleSave = async (values: any) => {
    message.loading('Saving...', 0);
    if (id) {
      ApiService.getClient()
        .collection('dashboards')
        .update(id, values)
        .then((res) => {
          message.success('Dashboard updated successfully');
          onFinish(res.data);
          onOpenChange(false);
        })
        .finally(() => {
          message.destroy();
        });
    } else {
      ApiService.getClient()
        .collection('dashboards')
        .create({
          ...values,
          assigned_user: user.id,
        })
        .then((res) => {
          form.resetFields();
          message.success('Dashboard added successfully');
          onFinish(res.data);
          onOpenChange(false);
        })
        .finally(() => {
          message.destroy();
        });
    }
  };

  return (
    <ModalForm
      form={form}
      onFinish={handleSave}
      open={open}
      onOpenChange={onOpenChange}
      title={id ? 'Edit Dashboard' : 'Add Dashboard'}
    >
      <ProFormText name='name' label='Name' />
      <ProFormCheckbox name='is_default'>Default</ProFormCheckbox>
    </ModalForm>
  );
}
