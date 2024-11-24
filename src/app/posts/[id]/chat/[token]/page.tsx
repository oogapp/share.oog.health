'use client'
import { use, useEffect, useState } from 'react';
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
    useCreateChatClient
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

function AuthenticatedApp({ userId, token, channelId }: { userId: string, token: string, channelId: string }) {

    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        tokenOrProvider: token,
        userData: { id: userId },
    });

    const [channel, setChannel] = useState<any | null>(null);

    async function handleSetChannel() {
        if (client) {
            let channels = await client.queryChannels({ type: 'reflection_v1', id: { $in: [channelId] } });
            //@ts-ignore
            setChannel(channels[0]);
        }
    }

    useEffect(() => {
        if (client) {
            handleSetChannel()
        }
    }, [client]);

    if (!client) return <div>loading...</div>


    return (
        <Chat client={client} initialNavOpen={false} theme='str-chat__theme-dark'>
            {channel && <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput grow />
                </Window>
                <Thread />
            </Channel>}
        </Chat>
    )
}

export default function ChatDetail({ params }: { params: Promise<{ token: string }> }) {
    let { token } = use(params);
    return (
        <div className='h-screen'>
            <AuthenticatedApp channelId={token} userId='8589934649' token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODU4OTkzNDY0OSJ9.QZGPWzOL3ZmF2-tfcYILJMgQpmR_6r8bxhN1Prg3ZfA' />
        </div>
    )
}
