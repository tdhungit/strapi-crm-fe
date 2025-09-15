import {
  BlocksProvider,
  LayersProvider,
  SelectorsProvider,
  StylesProvider,
} from '@grapesjs/react';
import { Tabs } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import { cx } from './common';

import {
  AppstoreAddOutlined,
  EditOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import CustomBlockManager from './CustomBlockManager';
import CustomLayerManager from './CustomLayerManager';
import CustomSelectorManager from './CustomSelectorManager';
import CustomStyleManager from './CustomStyleManager';

export default function RightSidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedTab, setSelectedTab] = useState('components');

  return (
    <div
      className={cx(
        'gjs-right-sidebar flex flex-col pt-2 em-builder-left-bar',
        className
      )}
    >
      <Tabs
        type='card'
        defaultActiveKey={selectedTab}
        onChange={(value) => setSelectedTab(value)}
        items={[
          {
            key: 'components',
            label: <AppstoreAddOutlined />,
            children: (
              <BlocksProvider>
                {(props) => <CustomBlockManager {...props} />}
              </BlocksProvider>
            ),
          },
          {
            key: 'properties',
            label: <EditOutlined />,
            children: (
              <div className='p-2'>
                <SelectorsProvider>
                  {(props) => <CustomSelectorManager {...props} />}
                </SelectorsProvider>
                <StylesProvider>
                  {(props) => <CustomStyleManager {...props} />}
                </StylesProvider>
              </div>
            ),
          },
          {
            key: 'layers',
            label: <LayoutOutlined />,
            children: (
              <LayersProvider>
                {(props) => <CustomLayerManager {...props} />}
              </LayersProvider>
            ),
          },
        ]}
      />
    </div>
  );
}
