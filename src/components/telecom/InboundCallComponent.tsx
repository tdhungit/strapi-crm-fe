import { Device } from '@twilio/voice-sdk';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

const { Text } = Typography;

type CallStatus =
  | 'idle'
  | 'device-ready'
  | 'incoming'
  | 'connecting'
  | 'in-call'
  | 'muted'
  | 'ended'
  | 'error';

export default function InboundCallComponent({ token }: { token?: string }) {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [muted, setMuted] = useState(false);
  const deviceRef = useRef<Device | null>(null);
  const connectionRef = useRef<any>(null);
  const [fromNumber, setFromNumber] = useState<string | undefined>(undefined);

  // Digits for numpad
  const digits = useMemo(
    () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'],
    []
  );

  useEffect(() => {
    if (!token) {
      setStatus('idle');
      return;
    }

    let mounted = true;

    // Initialize Twilio Device
    const setupDevice = async () => {
      try {
        const device = new Device(token);
        deviceRef.current = device;

        // Device event handlers
        device.on('ready', () => mounted && setStatus('device-ready'));
        device.on('error', () => mounted && setStatus('error'));
        device.on('incoming', (conn) => {
          if (!mounted) return;
          connectionRef.current = conn;
          setFromNumber(conn.parameters?.From);
          setStatus('incoming');

          // Auto set basic handlers for connection
          conn.on('accept', () => mounted && setStatus('in-call'));
          conn.on('disconnect', () => {
            if (!mounted) return;
            setStatus('ended');
            setMuted(false);
            connectionRef.current = null;
            setFromNumber(undefined);
          });
          conn.on('error', () => mounted && setStatus('error'));
        });

        // Create and register device
        await device.register();
      } catch (e: any) {
        console.error(e);
        setStatus('error');
      }
    };

    setupDevice();

    return () => {
      mounted = false;
      try {
        connectionRef.current?.disconnect();
      } catch (e: any) {
        console.error(e);
      }
      try {
        deviceRef.current?.destroy();
      } catch (e: any) {
        console.error(e);
      }
      deviceRef.current = null;
      connectionRef.current = null;
    };
  }, [token]);

  const acceptCall = () => {
    const conn = connectionRef.current;
    if (!conn) return;
    setStatus('connecting');
    try {
      conn.accept();
    } catch {
      setStatus('error');
    }
  };

  const hangup = () => {
    const conn = connectionRef.current;
    try {
      conn?.disconnect();
      deviceRef.current?.disconnectAll?.();
      setStatus('ended');
      setMuted(false);
    } catch {
      setStatus('error');
    }
  };

  const toggleMute = () => {
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      const next = !muted;
      conn.mute?.(next);
      setMuted(next);
      setStatus(next ? 'muted' : 'in-call');
    } catch {
      setStatus('error');
    }
  };

  const sendDigit = (d: string) => {
    const conn = connectionRef.current;
    if (!conn) return;
    try {
      conn.sendDigits(d);
    } catch {
      setStatus('error');
    }
  };

  const statusTagColor = (() => {
    switch (status) {
      case 'device-ready':
        return 'blue';
      case 'incoming':
        return 'orange';
      case 'connecting':
        return 'processing';
      case 'in-call':
        return 'green';
      case 'muted':
        return 'gold';
      case 'ended':
        return 'default';
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  })();

  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <Space align='center' style={{ justifyContent: 'space-between' }}>
          <Text>From: {fromNumber ?? '—'}</Text>
          <Tag color={statusTagColor}>{status}</Tag>
        </Space>

        <Space wrap>
          {status === 'incoming' && (
            <Button type='primary' onClick={acceptCall}>
              Accept
            </Button>
          )}
          <Button
            danger
            onClick={hangup}
            disabled={status === 'idle' || status === 'ended'}
          >
            Hang Up
          </Button>
          <Button
            onClick={toggleMute}
            disabled={!(status === 'in-call' || status === 'muted')}
          >
            {muted ? 'Resume' : 'Pause'}
          </Button>
        </Space>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {digits.map((d) => (
            <Button
              key={d}
              size='large'
              onClick={() => sendDigit(d)}
              disabled={!(status === 'in-call' || status === 'muted')}
            >
              {d}
            </Button>
          ))}
        </div>

        <Text type='secondary'>
          Use the numpad to send DTMF tones during the call. Pause mutes your
          microphone.
        </Text>
      </Space>
    </Card>
  );
}
