import { PercentageOutlined } from '@ant-design/icons';
import { Select, Space } from 'antd';
import { useEffect, useState } from 'react';

export interface TaxType {
  value: number;
  amount: number;
}

interface TaxInputProps {
  amount: number;
  value?: TaxType;
  onChange?: (value: TaxType) => void;
}

const TAX_RATES = [0, 1, 5, 10, 15, 20];

export default function TaxInput({
  amount,
  value: defaultValue,
  onChange,
}: TaxInputProps) {
  const [tax, setTax] = useState<TaxType>(
    defaultValue || { value: 0, amount: 0 }
  );

  // Update internal state when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setTax(defaultValue);
    }
  }, [defaultValue]);

  // Calculate tax amount when value or base amount changes
  useEffect(() => {
    const newTax = {
      value: tax.value || 0,
      amount: ((tax.value || 0) * amount) / 100,
    };

    setTax(newTax);
    onChange?.(newTax);
  }, [tax.value, amount]);

  const handleValueChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTax((prev) => ({
      ...prev,
      value: numericValue,
    }));
  };

  return (
    <Space.Compact className='w-full'>
      <Select
        options={[{ value: 'percentage', label: <PercentageOutlined /> }]}
        value='percentage'
        style={{ width: 60 }}
      />
      <Select
        value={tax.value ? tax.value.toString() : undefined}
        onChange={handleValueChange}
        placeholder='0'
        options={TAX_RATES.map((rate) => ({
          value: rate.toString(),
          label: `${rate}`,
        }))}
        className='w-full'
      />
    </Space.Compact>
  );
}
