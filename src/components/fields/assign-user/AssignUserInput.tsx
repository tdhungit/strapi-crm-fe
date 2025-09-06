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
  item: any;
  data: any;
  disable?: boolean;
  onChange?: (value: any) => void;
}) {
  const newData = { ...(data ? data : {}) };
  const user = useSelector((state: RootState) => state.auth.user);
  if (user?.id) {
    if (!newData.assigned_user) {
      newData.assigned_user = {
        id: user.id,
        username: user.username,
      };
    }
  }

  return (
    <RelationInput
      initialValues={initialValues}
      value={value}
      item={item}
      data={newData}
      disable={disable}
      onChange={(value: any) => {
        onChange?.(value);
      }}
    />
  );
}
