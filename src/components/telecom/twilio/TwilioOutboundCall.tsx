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
  const [call, setCall] = useState<any>(null);

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

  const onCall = async () => {
    if (!to || !deviceRef.current) {
      return;
    }

    const call = await deviceRef.current.connect({
      params: {
        To: to,
      },
    });

    call.on('disconnect', () => {
      console.log('Twilio device disconnect');
      setStatus('ready');
    });

    call.on('connect', () => {
      console.log('Twilio device connect');
      setStatus('connected');
    });

    call.on('ringing', function () {
      console.log('Twilio device ringing');
      setStatus('preparing');
    });

    call.on('accept', () => {
      console.log('Twilio device accept');
      setStatus('ringing');
    });

    call.on('mute', (isMuted: boolean) => {
      console.log('Twilio device mute', isMuted);
    });

    call.on('cancel', () => {
      console.log('Twilio device cancel');
      setStatus('ready');
    });

    setCall(call);
  };

  if (loading) return <Spin />;

  return (
    <OutboundCallComponent
      to={to}
      module={module}
      recordId={recordId}
      status={status}
      onCall={onCall}
      endCall={() => {
        if (deviceRef.current) {
          deviceRef.current.disconnectAll();
          deviceRef.current.destroy();
          console.log('Device destroyed');
        }
      }}
      onPause={(isPaused: boolean) => {
        if (call) {
          call.muted(isPaused);
        }
      }}
      onDigit={(digit: string) => {
        if (call && digit) {
          call.sendDigits(digit);
        }
      }}
    />
  );
}
