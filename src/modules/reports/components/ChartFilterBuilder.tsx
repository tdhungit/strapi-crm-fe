import type { ImmutableTree } from '@react-awesome-query-builder/antd';
import type { Config } from '@react-awesome-query-builder/core';
import { useState } from 'react';
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
  onChange?: (value: string) => void;
}) {
  const [tree, setTree] = useState<ImmutableTree | undefined>(undefined);

  return (
    <div>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700'>
          Builder
        </label>
        <QueryBuilder
          module={module}
          value={tree}
          onChange={(tree: ImmutableTree, config: Config) => setTree(tree)}
        />
      </div>
    </div>
  );
}
