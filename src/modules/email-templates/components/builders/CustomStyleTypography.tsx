import type { StylesResultProps } from '@grapesjs/react';
import { Row } from 'antd';
import StylePropertyField from './StylePropertyField';

export default function CustomStyleTypography({
  sectors,
}: Omit<StylesResultProps, 'Container'>) {
  const content: React.ReactNode[] = [];

  sectors.forEach((sector) => {
    if (sector.getId() === 'typography') {
      content.push(
        <Row gutter={[16, 16]} key={sector.getId()}>
          {sector.getProperties().map((prop) => (
            <StylePropertyField key={prop.getId()} prop={prop} />
          ))}
        </Row>
      );
    }
  });

  sectors.forEach((sector) => {
    if (sector.getId() === 'dimension') {
      content.push(
        <Row gutter={[16, 16]} key={sector.getId()} className='mt-2'>
          {sector.getProperties().map((prop) => (
            <StylePropertyField key={prop.getId()} prop={prop} />
          ))}
        </Row>
      );
    }
  });

  return <div className='p-2'>{content}</div>;
}
