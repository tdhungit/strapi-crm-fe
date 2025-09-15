import { type SelectorsResultProps } from '@grapesjs/react';

import Icon, { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { MAIN_BORDER_COLOR, cx } from './common';

export default function CustomSelectorManager({
  selectors,
  selectedState,
  states,
  targets,
  setState,
  addSelector,
  removeSelector,
}: Omit<SelectorsResultProps, 'Container'>) {
  const addNewSelector = () => {
    const next = selectors.length + 1;
    addSelector({ name: `new-${next}`, label: `New ${next}` });
  };

  const targetStr = targets.join(', ');

  return (
    <div className='gjs-custom-selector-manager flex flex-col gap-2 text-left'>
      <div className=''>
        <div className='mb-1 font-semibold'>Selectors</div>
        <div className='mb-1'>
          <Select
            value={selectedState}
            onChange={(ev) => setState(ev)}
            size='small'
            className='w-full'
          >
            <Select.Option value=''>- State -</Select.Option>
            {states.map((state) => (
              <Select.Option value={state.id} key={state.id}>
                {state.getName()}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <div
        className={cx(
          'flex items-center gap-2 flex-wrap p-2 bg-gray-100 border rounded',
          MAIN_BORDER_COLOR
        )}
      >
        {targetStr ? (
          <Button
            onClick={addNewSelector}
            className={cx('border rounded px-2')}
            size='small'
          >
            <Icon component={PlusOutlined} size={0.7} />
          </Button>
        ) : (
          <div className='opacity-70 text-xs'>Select a component</div>
        )}
        {selectors.map((selector) => (
          <div
            key={selector.toString()}
            className='px-2 flex items-center gap-1 whitespace-nowrap bg-gray-50 rounded'
          >
            <div>{selector.getLabel()}</div>
            <a onClick={() => removeSelector(selector)}>
              <CloseOutlined className='text-xs' />
            </a>
          </div>
        ))}
      </div>
      <div className='mb-1'>
        <span className='font-semibold'>Selected:</span>{' '}
        <span className='opacity-70'>{targetStr || 'None'}</span>
      </div>
    </div>
  );
}
