import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import CollectionFormModal from '../../../modules/collections/components/CollectionFormModal';
import CustomerListModal from './CustomerListModal';

export default function CustomerChoose({
  value: defaultValue,
  onChange,
  onlyList,
  placeholder,
  disabled,
}: {
  value?: any;
  onChange?: (value: any) => void;
  onlyList?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<any>(defaultValue);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (defaultValue && defaultValue !== value) {
      setValue(defaultValue);
      onChange?.(defaultValue);
    }
  }, [defaultValue]);

  const handleSelectRecord = (record: any) => {
    setValue(record);
    onChange?.(record);
    setFormOpen(false);
  };

  return (
    <div className='w-full'>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={`${value?.firstName || ''} ${value?.lastName || ''}`.trim()}
          placeholder={placeholder || 'Select Customer'}
          readOnly
          disabled={disabled}
        />

        {!onlyList && (
          <Button
            type='default'
            icon={<PlusOutlined />}
            onClick={() => setFormOpen(true)}
            disabled={disabled}
          ></Button>
        )}

        <Button
          type='default'
          icon={<SelectOutlined />}
          onClick={() => setOpen(true)}
          disabled={disabled}
        ></Button>
      </Space.Compact>

      <CustomerListModal
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelectRecord}
      />

      {!onlyList && (
        <CollectionFormModal
          module='contacts'
          open={formOpen}
          onOpenChange={(isOpen) => setFormOpen(isOpen)}
          onFinish={handleSelectRecord}
        />
      )}
    </div>
  );
}
