import { Modal } from 'antd';
import OutboundCallComponent from './OutboundCallComponent';

export default function OutboundCallModal({
  open,
  onOpenChange,
  to,
  module,
  recordId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to: string;
  module: string;
  recordId: string;
  onSuccess: () => void;
}) {
  return (
    <Modal
      title='Phone Call'
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={false}
    >
      <OutboundCallComponent
        to={to}
        module={module}
        recordId={recordId}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
