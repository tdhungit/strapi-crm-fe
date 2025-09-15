import { type TraitsResultProps } from '@grapesjs/react';
import TraitPropertyField from './TraitPropertyField';

export default function CustomTraitManager({
  traits,
}: Omit<TraitsResultProps, 'Container'>) {
  return (
    <div className='gjs-custom-style-manager text-left mt-3 p-1'>
      {!traits.length ? (
        <div className='text-xs border border-gray-200 rounded p-2'>
          No properties available
        </div>
      ) : (
        traits.map((trait) => (
          <TraitPropertyField key={trait.getId()} trait={trait} />
        ))
      )}
    </div>
  );
}
