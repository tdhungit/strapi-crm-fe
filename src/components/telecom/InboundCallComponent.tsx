import { Button, Card, Space, Tag, Typography } from 'antd';
import { useMemo } from 'react';

const { Text } = Typography;

export default function InboundCallComponent({
  fromNumber,
  status,
  statusTagColor = 'default',
  muted,
  acceptCall,
  hangup,
  toggleMute,
  sendDigit,
}: {
  fromNumber?: string;
  status?: string;
  statusTagColor?: string;
  muted?: boolean;
  acceptCall?: () => void;
  hangup?: () => void;
  toggleMute?: () => void;
  sendDigit?: (digit: string) => void;
}) {
  // Digits for numpad
  const digits = useMemo(
    () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'],
    []
  );

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
              onClick={() => sendDigit?.(d)}
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
