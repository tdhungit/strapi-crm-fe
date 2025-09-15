import { Modal, type ModalProps } from 'antd';
import * as React from 'react';

interface CustomModalProps extends Omit<ModalProps, 'title'> {
  title: React.ReactNode;
  close: () => void;
}

export default function CustomModal({
  children,
  title,
  close,
  ...props
}: CustomModalProps) {
  return (
    <Modal
      title={title}
      open={props.open}
      onCancel={close}
      onOk={close}
      width={1000}
      styles={{
        content: {
          padding: 10,
        },
      }}
      {...props}
    >
      {children}
    </Modal>
  );
}
