import { Alert, Modal } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores';
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
  const { telecomService } = useSelector(
    (state: RootState) => state.app.settings
  );

  return (
    <Modal
      title={false}
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={false}
    >
      {!telecomService && (
        <Alert message='Telecom service not configured' type='error' />
      )}

      {telecomService === 'twilio' && (
        <TwilioOutboundCall to={to} module={module} recordId={recordId} />
      )}
    </Modal>
  );
}
