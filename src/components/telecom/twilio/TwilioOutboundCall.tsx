import { Device } from '@twilio/voice-sdk';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores';
import OutboundCallComponent from '../OutboundCallComponent';

export default function TwilioOutboundCall({
  to,
  module,
  recordId,
}: {
  to: string;
  module: string;
  recordId: string;
}) {
  const settings = useSelector((state: RootState) => state?.app?.settings);
  const deviceRef = useRef<Device | null>(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('init');

  useEffect(() => {
    if (!to || !settings?.telecomOptions?.token) {
      return;
    }

    const device = new Device(settings?.telecomOptions?.token);
    device
      .register()
      .then(() => {
        console.log('Device registered');
        setStatus('ready');
        deviceRef.current = device;
      })
      .catch((error) => {
        console.error('Registration error:', error);
        setStatus(`Error: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (deviceRef.current) {
        deviceRef.current.disconnectAll();
        deviceRef.current.destroy();
        console.log('Device destroyed');
      }
    };
  }, [to, module, recordId, settings]);

  if (loading) return <Spin />;

  return (
    <OutboundCallComponent
      to={to}
      module={module}
      recordId={recordId}
      status={status}
    />
  );
}
