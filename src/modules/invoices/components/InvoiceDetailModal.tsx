import { CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Flex, Modal } from 'antd';
import { App } from 'antd/lib';
import { useRef, useState } from 'react';
import InvoiceService from '../InvoiceService';
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
  const { message } = App.useApp();
  const [invoice, setInvoice] = useState<any>(null);

  const [printing, setPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!invoice) {
      message.error('Invoice data not loaded yet');
      return;
    }

    setPrinting(true);
    InvoiceService.printInvoice(printRef, invoice, (status, resMessage) => {
      setPrinting(false);
      if (!status) {
        message.error(resMessage);
      }
    });
  };

  return (
    <Modal
      open={open}
      onOk={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      width={1000}
      closable={false}
      footer={
        <Flex justify='end' gap={4}>
          <Button
            type='primary'
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            loading={printing}
            disabled={!invoice}
          >
            Print
          </Button>
          <Button type='default' onClick={() => onOpenChange(false)}>
            <CloseOutlined /> Close
          </Button>
        </Flex>
      }
    >
      <div ref={printRef}>
        <InvoiceDetailComponent
          id={id}
          loaded={(invoiceData) => setInvoice(invoiceData)}
        />
      </div>
    </Modal>
  );
}
