import { EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Drawer, Space } from 'antd';
import { App } from 'antd/lib';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';
import InvoiceService from '../InvoiceService';
import InvoiceDetailComponent from './InvoiceDetailComponent';

export default function InvoiceDetailDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const navigate = useNavigate();

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
    <>
      {id && (
        <Drawer
          open={open}
          onClose={() => onOpenChange(false)}
          width={width || 800}
          title={invoice?.invoice_number}
          extra={
            <Space>
              <Button
                variant='solid'
                color='blue'
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/collections/invoices/detail/${id}`);
                }}
              >
                <EyeOutlined /> Detail
              </Button>
              <Button
                type='primary'
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                loading={printing}
                disabled={!invoice}
              >
                Print
              </Button>
            </Space>
          }
        >
          <div ref={printRef}>
            <InvoiceDetailComponent
              id={id}
              loaded={(invoice) => setInvoice(invoice)}
            />
          </div>
        </Drawer>
      )}
    </>
  );
}
