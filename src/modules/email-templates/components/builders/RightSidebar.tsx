import {
  BlocksProvider,
  LayersProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
} from '@grapesjs/react';
import { Tabs } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import { cx } from './common';

import {
  AppstoreAddOutlined,
  EditOutlined,
  LayoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import CustomBlockManager from './CustomBlockManager';
import CustomLayerManager from './CustomLayerManager';
import CustomSelectorManager from './CustomSelectorManager';
import CustomStyleManager from './CustomStyleManager';
import CustomTraitManager from './CustomTraitManager';

export default function RightSidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedTab, setSelectedTab] = useState('components');

  return (
    <div className={cx('gjs-right-sidebar flex flex-col', className)}>
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
              <TraitsProvider>
                {(props) => <CustomTraitManager {...props} />}
              </TraitsProvider>
            ),
          },
          {
            key: 'settings',
            label: <SettingOutlined />,
            children: (
              <>
                <SelectorsProvider>
                  {(props) => <CustomSelectorManager {...props} />}
                </SelectorsProvider>
                <StylesProvider>
                  {(props) => <CustomStyleManager {...props} />}
                </StylesProvider>
              </>
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
