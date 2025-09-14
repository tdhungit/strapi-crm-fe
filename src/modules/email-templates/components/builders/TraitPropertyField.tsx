import { useEditor } from '@grapesjs/react';
import { Button, Checkbox, Input, Select } from 'antd';
import type { Trait } from 'grapesjs';
import * as React from 'react';
import { ROUND_BORDER_COLOR, cx } from './common';

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
  trait: Trait;
}

export default function TraitPropertyField({
  trait,
  ...rest
}: StylePropertyFieldProps) {
  const editor = useEditor();
  const handleChange = (value: any) => {
    if (typeof value === 'string') {
      trait.setValue(value);
    } else {
      trait.setValue(value.target.value);
    }
  };

  const onChange = (ev: any) => {
    if (typeof ev === 'string') {
      handleChange(ev);
    } else {
      handleChange(ev.target.value);
    }
  };

  const handleButtonClick = () => {
    const command = trait.get('command');
    if (command) {
      if (typeof command === 'string') {
        editor.runCommand(command);
      } else {
        command(editor, trait);
      }
    }
  };

  const type = trait.getType();
  const defValue = trait.getDefault() || trait.attributes.placeholder;
  const value = trait.getValue();
  const valueWithDef = typeof value !== 'undefined' ? value : defValue;

  let inputToRender = (
    <Input
      placeholder={defValue}
      value={value}
      onChange={onChange}
      size='small'
    />
  );

  switch (type) {
    case 'select':
      {
        inputToRender = (
          <Select
            value={value}
            onChange={onChange}
            className='w-full'
            size='small'
          >
            {trait.getOptions().map((option) => (
              <Select.Option
                key={trait.getOptionId(option)}
                value={trait.getOptionId(option)}
              >
                {trait.getOptionLabel(option)}
              </Select.Option>
            ))}
          </Select>
        );
      }
      break;
    case 'color':
      {
        inputToRender = (
          <div className='flex items-center gap-2'>
            <div
              className={`w-[24px] h-[24px] ${ROUND_BORDER_COLOR} rounded`}
              style={{ backgroundColor: valueWithDef }}
            >
              <input
                type='color'
                className='w-full h-full cursor-pointer opacity-0'
                value={valueWithDef}
                onChange={(ev) => handleChange(ev.target.value)}
              />
            </div>
            <Input
              placeholder={defValue}
              value={value}
              onChange={onChange}
              size='small'
              className='flex-1'
            />
          </div>
        );
      }
      break;
    case 'checkbox':
      {
        inputToRender = (
          <Checkbox
            checked={value}
            onChange={(ev) => trait.setValue(ev.target.checked)}
          />
        );
      }
      break;
    case 'button':
      {
        inputToRender = (
          <Button onClick={handleButtonClick}>{trait.getLabel()}</Button>
        );
      }
      break;
  }

  return (
    <div {...rest} className={cx('mb-3 px-1 w-full')}>
      <div className={cx('flex mb-2 items-center')}>
        <div className='flex-grow capitalize'>{trait.getLabel()}</div>
      </div>
      {inputToRender}
    </div>
  );
}
