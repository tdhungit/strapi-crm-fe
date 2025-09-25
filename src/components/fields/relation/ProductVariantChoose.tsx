import { SelectOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import type dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ProductVariantsPricesModal from '../../../modules/products/components/ProductVariantsPricesModal';

export default function ProductVariantChoose({
  value: defaultValue,
  onChange,
  placeholder,
  disabled,
  warehouse,
  priceDate,
  priceType,
}: {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  warehouse?: any;
  priceDate?: dayjs.Dayjs;
  priceType?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [warehouseEntity, setWarehouseEntity] = useState<any>(null);
  const [priceDateObj, setPriceDateObj] = useState<any>(null);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (warehouse) {
      setWarehouseEntity(warehouse);
    }
  }, [warehouse]);

  useEffect(() => {
    if (priceDate) {
      setPriceDateObj(priceDate);
    }
  }, [priceDate]);

  const handleSelectRecord = (record: any) => {
    setValue(record);
    onChange?.(record);
    setOpen(false);
  };

  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value?.name || ''}
          placeholder={placeholder || 'Select'}
          readOnly
          disabled={disabled}
        />
        <Button
          type='default'
          icon={<SelectOutlined />}
          onClick={() => setOpen(true)}
          disabled={disabled}
        ></Button>
      </Space.Compact>

      <ProductVariantsPricesModal
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        onSelect={handleSelectRecord}
        warehouse={warehouseEntity}
        priceDate={priceDateObj}
        priceType={priceType}
      />
    </>
  );
}
