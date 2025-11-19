import { useDebounce } from 'ahooks';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import SqlInput from '../../../components/fields/sql/SqlInput';
import { camelToTitle } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';

interface ValuesType {
  query?: string;
  xAxis?: string;
  yAxis?: string;
  [key: string]: any;
}

export default function ChartQueryBuilder({
  chartType,
  value,
  onChange,
}: {
  chartType: string;
  value?: ValuesType;
  onChange?: (value: ValuesType) => void;
}) {
  const [sql, setSql] = useState<string>(value?.query || '');
  const debouncedQuery = useDebounce(sql, { wait: 500 });
  const [selectFields, setSelectFields] = useState<any[]>([]);

  const parseQuery = (query: string) => {
    return ApiService.request('post', '/reports/extra/parse-query', {
      query,
    });
  };

  const onQueryChange = (query: string) => {
    setSql(query);
    onValueChange('query', query);
  };

  const onValueChange = (key: string, val: any) => {
    const newValue = { ...value, [key]: val };
    onChange?.(newValue as ValuesType);
  };

  useEffect(() => {
    if (!debouncedQuery) return;
    parseQuery(debouncedQuery).then((result: any) => {
      const targetList: any[] = result.SelectStmt?.targetList || [];
      const fields: any[] = [];
      targetList.forEach((target: any) => {
        const field =
          target.ResTarget.val.ColumnRef.fields[0].String?.sval || '';
        if (field) {
          fields.push({
            value: field,
            label: camelToTitle(field),
          });
        }
      });
      setSelectFields(fields);
    });
  }, [debouncedQuery]);

  return (
    <div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700'>Query</label>
        <SqlInput value={sql} onChange={(query) => onQueryChange(query)} />
      </div>
      {['line', 'bar', 'pie'].includes(chartType) && (
        <div className='w-full mt-4 space-y-4'>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              X Axis Fields
            </label>
            <Select
              options={selectFields}
              placeholder='Select fields'
              className='w-full'
              value={value?.xAxis}
              onChange={(value) => onValueChange('xAxis', value)}
            />
          </div>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Y Axis Fields
            </label>
            <Select
              options={selectFields}
              placeholder='Select fields'
              className='w-full'
              value={value?.yAxis}
              onChange={(value) => onValueChange('yAxis', value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
