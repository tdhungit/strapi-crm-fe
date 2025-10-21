import { App, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import { getAllWidgets } from '../../collections/widgets';

export default function AddDashboardItemModal({
  open,
  onOpenChange,
  dashboard,
  onFinish,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboard: any;
  item?: any;
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
    const body: any = {
      dashboard: dashboard.id,
      title: values.title,
      widget,
      metadata: {
        module,
      },
    };

    let service;
    if (item?.documentId) {
      service = ApiService.getClient()
        .collection('dashboard-items')
        .update(item.documentId, body);
    } else {
      service = ApiService.getClient()
        .collection('dashboard-items')
        .create(body);
    }

    service
      .then(() => {
        notification.success({
          message: item?.documentId
            ? 'Dashboard item updated successfully'
            : 'Dashboard item added successfully',
        });
        onFinish?.();
        onOpenChange(false);
      })
      .catch(() => {
        notification.error({
          message: item?.documentId
            ? 'Failed to update dashboard item'
            : 'Failed to add dashboard item',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  useEffect(() => {
    if (item) {
      setValues({
        title: item.title,
        widget: `${item.metadata.module}:${item.widget}`,
        height: item.height,
      });
    }
  }, [item]);

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
