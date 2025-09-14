import { type StylesResultProps } from '@grapesjs/react';
import { Collapse, type CollapseProps } from 'antd';
import StylePropertyField from './StylePropertyField';

export default function CustomStyleManager({
  sectors,
}: Omit<StylesResultProps, 'Container'>) {
  const items: CollapseProps['items'] = [];

  sectors.forEach((sector) => {
    items.push({
      key: sector.getId(),
      label: sector.getName(),
      children: (
        <div className={`flex flex-wrap`}>
          {sector.getProperties().map((prop) => (
            <StylePropertyField key={prop.getId()} prop={prop} />
          ))}
        </div>
      ),
    });
  });

  return (
    <div className='gjs-custom-style-manager text-left'>
      <Collapse items={items} />
    </div>
  );
}
