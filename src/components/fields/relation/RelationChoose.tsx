import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import CollectionFormModal from '../../../modules/collections/components/CollectionFormModal';
import CollectionListModal from '../../../modules/collections/components/CollectionListModal';

export default function RelationChoose({
  module,
  value: defaultValue,
  onlyList,
  onChange,
}: {
  module: string;
  value?: any;
  onlyList?: boolean;
  onChange?: (value: any) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {}, [module]);

  const handleSelectRecord = (record: any) => {
    setValue(record);
    onChange?.(record);
    setFormOpen(false);
  };

  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value?.name || value?.id || ''}
          placeholder='Select'
          readOnly
        />
        {!onlyList && (
          <Button
            type='default'
            icon={<PlusOutlined />}
            onClick={() => setFormOpen(true)}
          ></Button>
        )}
        <Button
          type='default'
          icon={<SelectOutlined />}
          onClick={() => setOpen(true)}
        ></Button>
      </Space.Compact>

      <CollectionListModal
        module={module}
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        single
        onFinish={handleSelectRecord}
      />

      {!onlyList && (
        <CollectionFormModal
          module={module}
          open={formOpen}
          onOpenChange={(isOpen) => setFormOpen(isOpen)}
          onFinish={handleSelectRecord}
        />
      )}
    </>
  );
}
