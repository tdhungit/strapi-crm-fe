import { Device } from '@twilio/voice-sdk';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ApiService from '../../../services/ApiService';
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
  const deviceRef = useRef<Device | null>(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('init');

  useEffect(() => {
    if (!to) {
      return;
    }

    console.log({ to });
    ApiService.request('post', '/telecoms/twilio/token', { identity: to })
      .then((res) => {
        const device = new Device(res.token);

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
          });
      })
      .catch((err) => {
        console.error(err);
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
  }, [to, module, recordId]);

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
