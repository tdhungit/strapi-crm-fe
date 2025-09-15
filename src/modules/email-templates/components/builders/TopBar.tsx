import { DevicesProvider, WithEditor } from '@grapesjs/react';

import {
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from '@ant-design/icons';
import { Radio } from 'antd';
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
          <>
            <Radio.Group
              value={selected}
              onChange={(e) => select(e.target.value)}
              optionType='button'
              buttonStyle='solid'
            >
              {devices.map((device) => (
                <Radio.Button
                  value={device.id}
                  key={device.id}
                  title={device.getName()}
                >
                  {device.id === 'desktop' && <DesktopOutlined />}
                  {device.id === 'tablet' && <TabletOutlined />}
                  {device.id === 'mobileLandscape' && (
                    <MobileOutlined className='rotate-90' />
                  )}
                  {device.id === 'mobilePortrait' && <MobileOutlined />}
                </Radio.Button>
              ))}
            </Radio.Group>
          </>
        )}
      </DevicesProvider>
      <WithEditor>
        <TopBarButtons className='ml-auto px-2' />
      </WithEditor>
    </div>
  );
}
