import { App, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import { getAllWidgets } from '../../collections/widgets';
import ChartBuilder from '../../reports/components/ChartBuilder';

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
    if (!values.title) {
      notification.error({
        message: 'Please fill all the fields',
      });
      return;
    }

    let body: any = {
      dashboard: dashboard.id,
      title: values.title,
      type: values.type,
    };

    if (values.type === 'Widget') {
      const [module, widget] = values.widget.split(':');
      body = {
        ...body,
        widget,
        metadata: {
          module,
        },
      };
    } else {
      body = {
        ...body,
        metadata: values.metadata,
      };
    }

    message.loading('Saving...', 0);

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
      maskClosable={false}
      width={800}
    >
      <div className='mt-4 mb-6 flex flex-col space-y-4'>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
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
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Type
          </label>
          <Select
            value={values.type || 'Widget'}
            onChange={(e) => setValues((prev: any) => ({ ...prev, type: e }))}
            className='w-full'
          >
            <Select.Option value='Widget'>Widget</Select.Option>
            <Select.Option value='Builder'>Builder</Select.Option>
            <Select.Option value='Query'>Query</Select.Option>
          </Select>
        </div>

        {(!values.type || values.type === 'Widget') && (
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
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
        )}

        {(values.type === 'Query' || values.type === 'Builder') && (
          <div className='w-full'>
            <ChartBuilder
              values={{ ...values.metadata, queryType: values.type }}
              onChange={(newValue) =>
                setValues((prev: any) => ({
                  ...prev,
                  metadata: { ...prev.metadata, ...newValue },
                }))
              }
            />
          </div>
        )}

        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
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
