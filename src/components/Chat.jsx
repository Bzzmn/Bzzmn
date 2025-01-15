
// App.tsx
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const Chat = () => {
    useEffect(() => {
        createChat({
            webhookUrl: 'https://thefullstack.app.n8n.cloud/webhook/814cef86-6e0a-4283-9ada-57f1a1633f94/chat'
        });
    }, []);

    return (<div></div>);
};

export default Chat;