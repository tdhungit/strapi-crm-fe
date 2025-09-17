import { ModalForm } from '@ant-design/pro-components';

export default function CampaignActionSettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <ModalForm
      title='Campaign Action Settings'
      open={open}
      onOpenChange={onOpenChange}
    ></ModalForm>
  );
}
