import { type StylesResultProps } from '@grapesjs/react';
import { Collapse, Row, type CollapseProps } from 'antd';
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
        <Row gutter={[16, 16]}>
          {sector.getProperties().map((prop) => (
            <StylePropertyField key={prop.getId()} prop={prop} />
          ))}
        </Row>
      ),
    });
  });

  return (
    <div className='gjs-custom-style-manager text-left'>
      <Collapse items={items} size='small' />
    </div>
  );
}
