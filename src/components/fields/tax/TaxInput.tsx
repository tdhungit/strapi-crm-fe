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
    <Space.Compact style={{ width: '100%' }}>
      <div
        style={{
          width: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRight: 'none',
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        }}
      >
        <PercentageOutlined />
      </div>
      <Select
        value={tax.value ? tax.value.toString() : undefined}
        onChange={handleValueChange}
        style={{ width: '100%' }}
        placeholder='Tax'
        options={TAX_RATES.map((rate) => ({
          value: rate.toString(),
          label: `${rate}`,
        }))}
      />
    </Space.Compact>
  );
}
