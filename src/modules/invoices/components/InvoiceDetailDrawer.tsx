import { EyeOutlined } from '@ant-design/icons';
import { Button, Drawer, Space } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';
import InvoiceDetailComponent from './InvoiceDetailComponent';

export default function InvoiceDetailDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<any>(null);

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
                type='primary'
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/collections/invoices/detail/${id}`);
                }}
              >
                <EyeOutlined /> Detail
              </Button>
            </Space>
          }
        >
          <InvoiceDetailComponent
            id={id}
            loaded={(invoice) => setInvoice(invoice)}
          />
        </Drawer>
      )}
    </>
  );
}
