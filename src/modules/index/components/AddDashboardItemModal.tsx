import { Modal, Select } from 'antd';
import { getAllWidgets } from '../../collections/widgets';

export default function AddDashboardItemModal({
  open,
  openChange,
}: {
  open: boolean;
  openChange: (open: boolean) => void;
}) {
  const widgets = [];
  for (const module in getAllWidgets()) {
    for (const widget in getAllWidgets()[module]) {
      widgets.push({
        id: `${module}-${widget}`,
        name: widget,
        module,
      });
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => openChange(false)}
      onOk={() => openChange(false)}
      title='Add Dashboard Item'
    >
      <div className='my-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Select Widget
        </label>
        <Select className='w-full'>
          {widgets.map((widget) => (
            <Select.Option key={widget.id}>
              {widget.module}:{widget.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
}
