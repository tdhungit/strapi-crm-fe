import { useEditor } from '@grapesjs/react';
import * as React from 'react';

import Icon, {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Input, Radio, Select, Slider } from 'antd';
import type {
  Property,
  PropertyComposite,
  PropertyRadio,
  PropertySelect,
  PropertySlider,
  PropertyStack,
} from 'grapesjs';
import { BTN_CLS, ROUND_BORDER_COLOR, cx } from './common';

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
  prop: Property;
}

export default function StylePropertyField({
  prop,
  ...rest
}: StylePropertyFieldProps) {
  const editor = useEditor();
  const handleChange = (value: string) => {
    prop.upValue(value);
  };

  const onChange = (ev: any) => {
    if (typeof ev === 'string') {
      handleChange(ev);
    } else {
      handleChange(ev.target.value);
    }
  };

  const openAssets = () => {
    const { Assets } = editor;
    Assets.open({
      select: (asset, complete) => {
        prop.upValue(asset.getSrc(), { partial: !complete });
        if (complete) {
          Assets.close();
        }
      },
      types: ['image'],
      accept: 'image/*',
    });
  };

  const type = prop.getType();
  const defValue = prop.getDefaultValue();
  const canClear = prop.canClear();
  const hasValue = prop.hasValue();
  const value = prop.getValue();
  const valueString = hasValue ? value : '';
  const valueWithDef = hasValue ? value : defValue;

  let inputToRender = (
    <Input
      placeholder={defValue}
      value={valueString}
      onChange={onChange}
      size='small'
    />
  );

  switch (type) {
    case 'radio':
      {
        const radioProp = prop as PropertyRadio;
        inputToRender = (
          <Radio.Group value={value} onChange={onChange}>
            {radioProp.getOptions().map((option) => (
              <Radio
                key={radioProp.getOptionId(option)}
                value={radioProp.getOptionId(option)}
              >
                {radioProp.getOptionLabel(option)}
              </Radio>
            ))}
          </Radio.Group>
        );
      }
      break;
    case 'select':
      {
        const selectProp = prop as PropertySelect;
        inputToRender = (
          <Select
            value={value}
            onChange={onChange}
            className='w-full'
            size='small'
          >
            {selectProp.getOptions().map((option) => (
              <Select.Option
                key={selectProp.getOptionId(option)}
                value={selectProp.getOptionId(option)}
              >
                {selectProp.getOptionLabel(option)}
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
              value={valueString}
              onChange={onChange}
              size='small'
              className='flex-1'
            />
          </div>
        );
      }
      break;
    case 'slider':
      {
        const sliderProp = prop as PropertySlider;
        inputToRender = (
          <Slider
            value={parseFloat(value)}
            min={sliderProp.getMin()}
            max={sliderProp.getMax()}
            step={sliderProp.getStep()}
            onChange={onChange}
          />
        );
      }
      break;
    case 'file':
      {
        inputToRender = (
          <div className='flex flex-col items-center gap-3'>
            {value && value !== defValue && (
              <div
                className='w-[50px] h-[50px] rounded inline-block bg-cover bg-center cursor-pointer'
                style={{ backgroundImage: `url("${value}")` }}
                onClick={() => handleChange('')}
              />
            )}
            <button type='button' onClick={openAssets} className={BTN_CLS}>
              Select Image
            </button>
          </div>
        );
      }
      break;
    case 'composite':
      {
        const compositeProp = prop as PropertyComposite;
        inputToRender = (
          <div
            className={cx('flex flex-wrap p-2 bg-gray-100', ROUND_BORDER_COLOR)}
          >
            {compositeProp.getProperties().map((prop) => (
              <StylePropertyField key={prop.getId()} prop={prop} />
            ))}
          </div>
        );
      }
      break;
    case 'stack':
      {
        const stackProp = prop as PropertyStack;
        const layers = stackProp.getLayers();
        const isTextShadow = stackProp.getName() === 'text-shadow';
        inputToRender = (
          <div
            className={cx(
              'flex flex-col p-2 gap-2 bg-gray-100 min-h-[54px]',
              ROUND_BORDER_COLOR
            )}
          >
            {layers.map((layer) => (
              <div key={layer.getId()} className={ROUND_BORDER_COLOR}>
                <div className='flex gap-1 bg-slate-200 px-2 py-1 items-center'>
                  <Button
                    size='small'
                    onClick={() => layer.move(layer.getIndex() - 1)}
                  >
                    <Icon size={0.7} component={ArrowUpOutlined} />
                  </Button>
                  <Button
                    size='small'
                    onClick={() => layer.move(layer.getIndex() + 1)}
                  >
                    <Icon size={0.7} component={ArrowDownOutlined} />
                  </Button>
                  <button className='flex-grow' onClick={() => layer.select()}>
                    {layer.getLabel()}
                  </button>
                  <div
                    className={cx(
                      'bg-white min-w-[17px] min-h-[17px] text-black text-sm flex justify-center',
                      ROUND_BORDER_COLOR
                    )}
                    style={layer.getStylePreview({
                      number: { min: -3, max: 3 },
                      camelCase: true,
                    })}
                  >
                    {isTextShadow && 'T'}
                  </div>
                  <Button size='small' onClick={() => layer.remove()}>
                    <Icon size={0.7} component={DeleteOutlined} />
                  </Button>
                </div>
                {layer.isSelected() && (
                  <div className='p-2 flex flex-wrap'>
                    {stackProp.getProperties().map((prop) => (
                      <StylePropertyField key={prop.getId()} prop={prop} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      break;
  }

  return (
    <div
      {...rest}
      className={cx('mb-3 px-1', prop.isFull() ? 'w-full' : 'w-1/2')}
    >
      <div className={cx('flex mb-2 items-center', canClear && 'text-sky-300')}>
        <div className='flex-grow capitalize'>{prop.getLabel()}</div>
        {canClear && (
          <button onClick={() => prop.clear()}>
            <Icon size={0.7} component={CloseOutlined} />
          </button>
        )}
        {type === 'stack' && (
          <Button
            size='small'
            className='!ml-2'
            onClick={() => (prop as PropertyStack).addLayer({}, { at: 0 })}
          >
            <Icon size={1} component={PlusOutlined} />
          </Button>
        )}
      </div>
      {inputToRender}
    </div>
  );
}
