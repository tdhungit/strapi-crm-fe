import { useDebounce } from 'ahooks';
import { useEffect, useState } from 'react';
import SqlInput from '../../../components/fields/sql/SqlInput';
import ApiService from '../../../services/ApiService';

export default function ChartQueryBuilder({
  chartType,
  value,
  onChange,
}: {
  chartType: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [sql, setSql] = useState<string>(value || '');
  const debouncedQuery = useDebounce(sql, { wait: 500 });
  const [selectFields, setSelectFields] = useState<any[]>([]);

  const parseQuery = (query: string) => {
    return ApiService.request('post', '/reports/extra/parse-query', {
      query,
    });
  };

  const onQueryChange = (query: string) => {
    setSql(query);
    onChange?.(query);
  };

  useEffect(() => {
    parseQuery(debouncedQuery).then((result: any) => {
      const targetList: any[] = result.targetList || [];
      const fields: any[] = [];
    });
  }, [debouncedQuery]);

  return (
    <div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Query
        </label>
        <SqlInput value={sql} onChange={(query) => onQueryChange(query)} />
      </div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Select Fields
        </label>
      </div>
    </div>
  );
}
