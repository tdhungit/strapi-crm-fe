import {
  ArrowLeftOutlined,
  PauseOutlined,
  PhoneFilled,
  PhoneOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons';
import { Button, Input, Space, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

const { Text } = Typography;

export default function OutboundCallComponent({
  to,
  module,
  recordId,
  status,
}: {
  to: string;
  module: string;
  recordId: string;
  status: string;
}) {
  const [number, setNumber] = useState<string>(to || '');
  const [digits, setDigits] = useState<string>('');
  const [isCalling, setIsCalling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const timerRef = useRef<number | null>(null);

  const keypad = useMemo(
    () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'],
    []
  );

  useEffect(() => {
    // Reset
    stopTimer();
    setIsCalling(false);
    setDurationSec(0);
    setNumber(to || '');
  }, [to, module, recordId]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = window.setInterval(() => {
      setDurationSec((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const appendDigit = (d: string) => {
    if (isCalling) setDigits((prev) => prev + d);
    // If in-call, this could send DTMF; left as a placeholder
  };

  const backspace = () => {
    setDigits((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!isCalling) {
      if (!number) return;
      setIsCalling(true);
      startTimer();
      // TODO: integrate with backend/twilio
      // Example payload you might send:
      // await fetch('/api/telecom/twilio/call', { method: 'POST', body: JSON.stringify({ to: number, module, recordId }) })
    } else {
      // End call
      setIsCalling(false);
      stopTimer();
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <>
      <div className='pb-4 text-lg font-bold'>
        Phone Call (<span className='text-sm text-red-500'>{status}</span>)
      </div>

      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Input
            value={number + (digits ? '#' + digits : '')}
            onChange={(e) => setDigits(e.target.value)}
            disabled={true}
            placeholder='Enter phone number'
            size='large'
            className='font-bold !text-black'
          />
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={backspace}
            disabled={digits.length === 0}
          />
        </div>

        {isCalling && (
          <Text type='secondary'>Duration: {formatDuration(durationSec)}</Text>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {keypad.map((k) => (
            <Button
              key={k}
              size='large'
              onClick={() => appendDigit(k)}
              disabled={!isCalling}
            >
              {k}
            </Button>
          ))}
        </div>
      </Space>

      <Space
        style={{
          marginTop: 16,
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Button
          onClick={() => togglePause()}
          variant='solid'
          color={isPaused ? 'green' : 'volcano'}
          icon={isPaused ? <PlaySquareOutlined /> : <PauseOutlined />}
          disabled={!isCalling}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          type={isCalling ? 'default' : 'primary'}
          danger={isCalling}
          icon={isCalling ? <PhoneFilled /> : <PhoneOutlined />}
          onClick={handleCall}
        >
          {isCalling ? 'End Call' : 'Call'}
        </Button>
      </Space>
    </>
  );
}
