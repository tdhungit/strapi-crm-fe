import { Device } from '@twilio/voice-sdk';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiService from '../../../services/ApiService';
import type { RootState } from '../../../stores';
import { setSettings } from '../../../stores/appSlice';
import TwilioInboundCallModal from './TwilioInboundCallModal';

export default function TwilioInboundCallListener() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const deviceRef = useRef<Device | null>(null);

  const [open, setOpen] = useState(false);
  const [call, setCall] = useState<any>(null);
  const [status, setStatus] = useState('init');

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    ApiService.request('post', '/telecoms/twilio/token', {
      identity: user.username,
    })
      .then((res) => {
        if (!res.token) {
          console.error('Token not found');
          return;
        }

        dispatch(
          setSettings({
            telecomOptions: {
              token: res.token,
            },
          })
        );

        const device = new Device(res.token);

        device.on('incoming', (call) => {
          setOpen(true);
          setCall(call);
        });

        device
          .register()
          .then(() => {
            console.log('Device registered');
            deviceRef.current = device;
            setStatus('ready');
          })
          .catch((error) => {
            console.error('Registration error:', error);
            setStatus(`Error: ${error.message}`);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user]);

  const acceptCall = () => {
    if (!call) {
      return;
    }

    call.accept();
  };

  const hangup = () => {
    if (!call) {
      return;
    }

    call.disconnect();

    if (deviceRef.current) {
      deviceRef.current.disconnectAll();
      deviceRef.current.destroy();
    }

    setOpen(false);
  };

  return (
    <>
      <TwilioInboundCallModal
        open={open}
        onOpenChange={setOpen}
        acceptCall={acceptCall}
        hangup={hangup}
        status={status}
      />
    </>
  );
}
