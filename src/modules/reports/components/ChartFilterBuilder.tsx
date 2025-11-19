import type { ImmutableTree } from '@react-awesome-query-builder/antd';
import type { Config } from '@react-awesome-query-builder/core';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import MetadataService from '../../../services/MetadataService';
import { exportQuery, loadTreeFromJson } from '../utils/queryExport';
import QueryBuilder from './QueryBuilder';

export default function ChartFilterBuilder({
  chartType,
  module,
  value,
  onChange,
}: {
  chartType: string;
  module: string;
  value?: any;
  onChange?: (value: any) => void;
}) {
  const [tree, setTree] = useState<ImmutableTree | undefined>(undefined);
  // const [config, setConfig] = useState<Config | undefined>(undefined);
  const [selectFields, setSelectFields] = useState<any[]>([]);

  const handleChange = (tree: ImmutableTree, config: Config) => {
    setTree(tree);
    // setConfig(config);
    const exported = exportQuery(tree, config);
    onChange?.(exported);
  };

  useEffect(() => {
    if (value) {
      const loadTreeObj = loadTreeFromJson(value);
      setTree(loadTreeObj);
    }
  }, [value]);

  useEffect(() => {
    if (!module) return;
    const fields = MetadataService.getContentTypeFieldOptions(module);
    setSelectFields(fields);
  }, [module]);

  return (
    <div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700'>
          Builder
        </label>
        <QueryBuilder
          module={module}
          value={tree}
          onChange={(tree: ImmutableTree, config: Config) => {
            handleChange(tree, config);
          }}
        />
      </div>

      {['line', 'bar', 'pie'].includes(chartType) && (
        <>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              X Axis Fields
            </label>
            <Select options={selectFields} placeholder='Select fields' />
          </div>
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Y Axis Fields
            </label>
            <Select options={selectFields} placeholder='Select fields' />
          </div>
        </>
      )}
    </div>
  );
}
