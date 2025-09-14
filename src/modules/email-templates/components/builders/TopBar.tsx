import { DevicesProvider, WithEditor } from '@grapesjs/react';

import { Select } from 'antd';
import * as React from 'react';
import { cx } from './common';
import TopBarButtons from './TopbarButtons';

export default function TopBar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('gjs-top-sidebar flex items-center p-1', className)}>
      <DevicesProvider>
        {({ selected, select, devices }) => (
          <Select
            value={selected}
            onChange={(value) => select(value)}
            size='small'
          >
            {devices.map((device) => (
              <Select.Option value={device.id} key={device.id}>
                {device.getName()}
              </Select.Option>
            ))}
          </Select>
        )}
      </DevicesProvider>
      <WithEditor>
        <TopBarButtons className='ml-auto px-2' />
      </WithEditor>
    </div>
  );
}
