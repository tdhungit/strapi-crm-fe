import { App, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import ApiService from '../../../services/ApiService';
import { getAllWidgets } from '../../collections/widgets';

export default function AddDashboardItemModal({
  open,
  onOpenChange,
  dashboard,
  onFinish,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboard: any;
  onFinish?: () => void;
}) {
  const { message, notification } = App.useApp();

  const widgets = [];
  for (const module in getAllWidgets()) {
    for (const widget in getAllWidgets()[module]) {
      widgets.push({
        id: `${module}:${widget}`,
        name: widget,
        module,
      });
    }
  }

  const [values, setValues] = useState<any>({ height: 300 });

  const handleSelectWidget = (widgetId: string) => {
    setValues((prev: any) => ({ ...prev, widget: widgetId }));
  };

  const handleSave = () => {
    if (!values.title || !values.widget) {
      notification.error({
        message: 'Please fill all the fields',
      });
      return;
    }

    message.loading('Saving...', 0);
    const [module, widget] = values.widget.split(':');
    ApiService.getClient()
      .collection('dashboard-items')
      .create({
        dashboard: dashboard.id,
        title: values.title,
        widget,
        metadata: {
          module,
        },
      })
      .then(() => {
        notification.success({
          message: 'Dashboard item added successfully',
        });
        onFinish?.();
        onOpenChange(false);
      })
      .catch(() => {
        notification.error({
          message: 'Failed to add dashboard item',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => handleSave()}
      title='Add Dashboard Item'
    >
      <div className='mt-4 mb-6 flex flex-col space-y-4'>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Title
          </label>
          <Input
            placeholder='Title'
            onChange={(e) =>
              setValues((prev: any) => ({ ...prev, title: e.target.value }))
            }
            value={values.title}
          />
        </div>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Select Widget
          </label>
          <Select
            value={values.widget}
            className='w-full'
            onChange={handleSelectWidget}
          >
            {widgets.map((widget) => (
              <Select.Option key={widget.id} value={widget.id}>
                {widget.module}:{widget.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Height
          </label>
          <Input
            placeholder='Height'
            onChange={(e) =>
              setValues((prev: any) => ({ ...prev, height: e.target.value }))
            }
            value={values.height}
            type='number'
          />
        </div>
      </div>
    </Modal>
  );
}
