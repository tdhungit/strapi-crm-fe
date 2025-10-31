import { MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { useState } from 'react';
import OutboundCallModal from '../../telecom/OutboundCallModal';
import SendSMSModal from '../../telecom/SendSMSModal';

export default function PhoneView({ value }: { value: string }) {
  const [openSendSMSModal, setOpenSendSMSModal] = useState(false);
  const [openCallModal, setOpenCallModal] = useState(false);

  return (
    <>
      <Space>
        <div>{value}</div>
        <button
          className='p-0 cursor-pointer border-0'
          onClick={() => setOpenCallModal(true)}
        >
          <PhoneOutlined />
        </button>
        <button
          className='p-0 cursor-pointer border-0'
          onClick={() => setOpenSendSMSModal(true)}
        >
          <MessageOutlined />
        </button>
      </Space>

      <SendSMSModal
        open={openSendSMSModal}
        onOpenChange={setOpenSendSMSModal}
        to={value}
        module=''
        recordId=''
        onSuccess={() => {}}
      />

      <OutboundCallModal
        open={openCallModal}
        onOpenChange={setOpenCallModal}
        to={value}
        module=''
        recordId=''
        onSuccess={() => {}}
      />
    </>
  );
}
