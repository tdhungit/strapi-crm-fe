import { useSelector } from 'react-redux';
import type { RootState } from '../../stores';
import TwilioInboundCallListener from './twilio/TwilioInboundCallListener';

export default function InboundCallListener() {
  const { telecomService } = useSelector(
    (state: RootState) => state.app.settings
  );

  return <>{telecomService === 'twilio' && <TwilioInboundCallListener />}</>;
}
