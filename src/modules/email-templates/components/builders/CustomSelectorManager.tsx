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
    <div className='gjs-custom-selector-manager p-2 flex flex-col gap-2 text-left'>
      <div className='flex items-center'>
        <div className='flex-grow'>Selectors</div>
        <Select
          value={selectedState}
          onChange={(ev) => setState(ev)}
          size='small'
        >
          <Select.Option value=''>- State -</Select.Option>
          {states.map((state) => (
            <Select.Option value={state.id} key={state.id}>
              {state.getName()}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div
        className={cx(
          'flex items-center gap-2 flex-wrap p-2 bg-gray-100 border rounded min-h-[45px]',
          MAIN_BORDER_COLOR
        )}
      >
        {targetStr ? (
          <Button
            onClick={addNewSelector}
            className={cx('border rounded px-2 py-1')}
          >
            <Icon component={PlusOutlined} size={0.7} />
          </Button>
        ) : (
          <div className='opacity-70'>Select a component</div>
        )}
        {selectors.map((selector) => (
          <div
            key={selector.toString()}
            className='px-2 py-1 flex items-center gap-1 whitespace-nowrap bg-sky-500 rounded'
          >
            <div>{selector.getLabel()}</div>
            <Button onClick={() => removeSelector(selector)}>
              <Icon component={CloseOutlined} size={0.7} />
            </Button>
          </div>
        ))}
      </div>
      <div>
        Selected: <span className='opacity-70'>{targetStr || 'None'}</span>
      </div>
    </div>
  );
}
