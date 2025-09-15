import { StylesProvider, type TraitsResultProps } from '@grapesjs/react';
import { Alert } from 'antd';
import CustomStyleTypography from './CustomStyleTypography';
import TraitPropertyField from './TraitPropertyField';

export default function CustomTraitManager({
  traits,
}: Omit<TraitsResultProps, 'Container'>) {
  return (
    <div className='gjs-custom-style-manager text-left mt-3 p-1'>
      {!traits.length ? (
        <div className='mb-4'>
          <Alert message='No properties available' type='error' />
        </div>
      ) : (
        traits.map((trait) => (
          <TraitPropertyField key={trait.getId()} trait={trait} />
        ))
      )}

      <div>
        <StylesProvider>
          {(props) => <CustomStyleTypography {...props} />}
        </StylesProvider>
      </div>
    </div>
  );
}
