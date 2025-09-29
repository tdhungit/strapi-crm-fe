import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores';
import RelationInput from '../relation/RelationInput';

export default function AssignUserInput({
  initialValues,
  value,
  item,
  data,
  disable,
  onChange,
}: {
  initialValues?: any;
  value?: any;
  item: {
    options: { target: string; mainField: string; [key: string]: any };
    [key: string]: any;
  };
  data?: any;
  disable?: boolean;
  onChange?: (value: any) => void;
}) {
  let newData = initialValues ? { ...initialValues } : { ...data };
  const user = useSelector((state: RootState) => state?.auth?.user);
  if (user?.id) {
    newData = {
      initValue: user.id,
      initLabel: user.username,
    };
  }

  return (
    <RelationInput
      initialValues={newData}
      value={value}
      item={item}
      data={data}
      disable={disable}
      onChange={(value: any) => {
        onChange?.(value);
      }}
    />
  );
}
