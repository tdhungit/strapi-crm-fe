import { Modal } from 'antd';
import InvoiceDetailComponent from './InvoiceDetailComponent';

export default function InvoiceDetailModal({
  open,
  onOpenChange,
  id,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}) {
  return (
    <Modal
      open={open}
      onOk={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
    >
      <InvoiceDetailComponent id={id} />
    </Modal>
  );
}
