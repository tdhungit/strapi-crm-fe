import type { StylesResultProps } from '@grapesjs/react';
import { Row } from 'antd';
import StylePropertyField from './StylePropertyField';

export default function CustomStyleTypography({
  sectors,
}: Omit<StylesResultProps, 'Container'>) {
  let content = <></>;
  sectors.forEach((sector) => {
    if (sector.getId() === 'typography') {
      content = (
        <Row gutter={[16, 16]}>
          {sector.getProperties().map((prop) => (
            <StylePropertyField key={prop.getId()} prop={prop} />
          ))}
        </Row>
      );
    }
  });

  return <div className='p-2'>{content}</div>;
}
