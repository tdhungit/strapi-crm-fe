import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import InboundCallComponent from '../InboundCallComponent';

export default function TwilioInboundCallModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={false}
      closable={false}
      maskClosable={false}
      mask={!isMinimized}
      wrapClassName={isMinimized ? 'modal-minimized-wrap' : ''}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Inbound Call</span>
          <Button size='small' onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </div>
      }
      width={isMinimized ? 300 : 500}
      style={
        isMinimized
          ? {
              position: 'fixed',
              top: 70,
              right: 21,
              height: 34,
              padding: 0,
              overflow: 'hidden',
            }
          : {}
      }
      styles={{
        content: {
          padding: isMinimized ? 5 : 16,
        },
        header: {
          padding: 0,
          margin: 0,
        },
        footer: {
          display: 'none',
        },
      }}
    >
      {!isMinimized && (
        <div className='mt-2'>
          <InboundCallComponent />
        </div>
      )}
    </Modal>
  );
}
