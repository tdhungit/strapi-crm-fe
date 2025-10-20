import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
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
  onFinish: () => void;
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
      });
    }
  }, [dashboard]);

  const handleSave = async (values: any) => {
    message.loading('Saving...', 0);
    if (id) {
      ApiService.getClient()
        .collection('dashboards')
        .update(id, values)
        .then(() => {
          message.success('Dashboard updated successfully');
          onOpenChange(false);
        })
        .finally(() => {
          form.resetFields();
          message.destroy();
          onFinish();
        });
    } else {
      ApiService.getClient()
        .collection('dashboards')
        .create({
          ...values,
          assigned_user: user.id,
        })
        .then(() => {
          form.resetFields();
          message.success('Dashboard added successfully');
          onOpenChange(false);
        })
        .finally(() => {
          message.destroy();
          onFinish();
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
    </ModalForm>
  );
}
