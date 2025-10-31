import { Modal } from 'antd';
import TwilioOutboundCall from './twilio/TwilioOutboundCall';

export default function OutboundCallModal({
  open,
  onOpenChange,
  to,
  module,
  recordId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to: string;
  module: string;
  recordId: string;
}) {
  return (
    <Modal
      title={false}
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={false}
    >
      <TwilioOutboundCall to={to} module={module} recordId={recordId} />
    </Modal>
  );
}
