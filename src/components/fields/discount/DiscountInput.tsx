import { DollarOutlined, PercentageOutlined } from '@ant-design/icons';
import { Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

export interface DiscountType {
  type: 'percentage' | 'amount';
  value: number;
  amount: number;
}

interface DiscountInputProps {
  amount: number;
  value?: DiscountType;
  onChange?: (value: DiscountType) => void;
}

export default function DiscountInput({
  amount,
  value: defaultValue,
  onChange,
}: DiscountInputProps) {
  const [discount, setDiscount] = useState<DiscountType>(
    defaultValue || { type: 'percentage', value: 0, amount: 0 }
  );

  const options = [
    { value: 'percentage', label: <PercentageOutlined /> },
    { value: 'amount', label: <DollarOutlined /> },
  ];

  // Update internal state when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setDiscount(defaultValue);
    }
  }, [defaultValue]);

  // Calculate discount amount when type, value, or base amount changes
  useEffect(() => {
    if (!discount) return;

    const newDiscount = { ...discount };

    if (discount.type === 'percentage') {
      newDiscount.amount = (discount.value * amount) / 100;
    } else {
      newDiscount.amount = Math.min(discount.value, amount);
    }

    setDiscount(newDiscount);
    onChange?.(newDiscount);
  }, [discount.type, discount.value, amount]);

  const handleTypeChange = (type: 'percentage' | 'amount') => {
    setDiscount((prev) => ({
      ...prev,
      type,
      value: 0, // Reset value when changing type
      amount: 0,
    }));
    console.log(discount);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount((prev) => ({
      ...prev,
      value,
    }));
  };

  return (
    <Space.Compact>
      <Select
        value={discount.type}
        options={options}
        onChange={handleTypeChange}
        style={{ width: 60 }}
      />
      <Input
        type='number'
        min={0}
        max={discount.type === 'percentage' ? 100 : undefined}
        value={discount.value || ''}
        onChange={handleValueChange}
        style={{ width: '100%' }}
        step={discount.type === 'percentage' ? 1 : 0.01}
      />
    </Space.Compact>
  );
}
