import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';
import { useEffect } from 'react';
import ApiService from '../../services/ApiService';

export default function ChatBox() {
  useEffect(() => {
    ApiService.request('GET', '/settings/system', { name: 'chatbox' }).then(
      (res) => {
        if (res?.chatbox?.n8nCRMWebhook) {
          createChat({
            webhookUrl: res.chatbox.n8nCRMWebhook,
          });
        } else if (res?.chatbox?.CRMScript) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = res.chatbox.CRMScript;
          document.body.appendChild(script);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  });

  return <></>;
}
