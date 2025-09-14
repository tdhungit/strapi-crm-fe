import { CloseOutlined } from '@ant-design/icons';
import { type AssetsResultProps, useEditor } from '@grapesjs/react';
import { Button } from 'antd';
import type { Asset } from 'grapesjs';
import { BTN_CLS } from './common';

export type CustomAssetManagerProps = Pick<
  AssetsResultProps,
  'assets' | 'close' | 'select'
>;

export default function CustomAssetManager({
  assets,
  select,
}: CustomAssetManagerProps) {
  const editor = useEditor();

  const remove = (asset: Asset) => {
    editor.Assets.remove(asset);
  };

  return (
    <div className='grid grid-cols-3 gap-2 pr-2'>
      {assets.map((asset) => (
        <div
          key={asset.getSrc()}
          className='relative group rounded overflow-hidden'
        >
          <img className='display-block' src={asset.getSrc()} />
          <div className='flex flex-col items-center justify-end absolute top-0 left-0 w-full h-full p-5 bg-zinc-700/75 group-hover:opacity-100 opacity-0 transition-opacity'>
            <Button className={BTN_CLS} onClick={() => select(asset, true)}>
              Select
            </Button>
            <Button
              className='absolute top-2 right-2'
              onClick={() => remove(asset)}
            >
              <CloseOutlined />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
