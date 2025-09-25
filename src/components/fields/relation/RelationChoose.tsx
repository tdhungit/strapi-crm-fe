import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import CollectionFormModal from '../../../modules/collections/components/CollectionFormModal';
import CollectionListModal from '../../../modules/collections/components/CollectionListModal';
import MetadataService from '../../../services/MetadataService';

export default function RelationChoose({
  module,
  value: defaultValue,
  onlyList,
  onChange,
  placeholder,
  disabled,
}: {
  module: string;
  value?: any;
  onlyList?: boolean;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [mainField, setMainField] = useState('name');
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    const contentType = MetadataService.getContentTypeByModule(module);
    if (contentType) {
      setMainField(contentType.settings?.mainField || 'name');
    }
  }, [module]);

  const handleSelectRecord = (record: any) => {
    setValue(record);
    onChange?.(record);
    setFormOpen(false);
  };

  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value?.name || value?.[mainField] || ''}
          placeholder={placeholder || 'Select'}
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
