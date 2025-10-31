import { useState } from 'react';
import TwilioInboundCallModal from './TwilioInboundCallModal';

export default function TwilioInboundCallListener() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TwilioInboundCallModal open={open} onOpenChange={setOpen} />
    </>
  );
}
