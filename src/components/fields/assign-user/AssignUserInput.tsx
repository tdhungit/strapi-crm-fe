import type { FormInstance } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores';
import RelationInput from '../relation/RelationInput';

export default function AssignUserInput({
  item,
  form,
  data,
}: {
  item: any;
  form: FormInstance;
  data: any;
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

  return <RelationInput item={item} form={form} data={newData} />;
}
