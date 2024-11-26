'use client'
import { getChatByToken } from '@/api/chats';
import ChatChannelHeader from '@/components/ChatChannelHeader';
import Congrats from '@/components/Congrats';
import { SparkyConversation } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
    useCreateChatClient
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

function AuthenticatedApp({ userId, token, channelId }: { userId: string, token: string, channelId: string }) {

    const [chat, setChat] = useState<SparkyConversation | null>(null);
    const [showAnimation, setShowAnimation] = useState(false)

    useEffect(() => {
        if (channelId) {
            async function fetchChat() {
                let channel = await getChatByToken(channelId);
                setChat(channel)
            }
            fetchChat()
        }
    }, [channelId]);

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
            let chan = channels[0];
            chan.on(event => {
                //@ts-ignore
                if (event.type == "ce_credit_earned") {
                    setShowAnimation(true)
                }
            })
            setChannel(chan)
        }
    }

    useEffect(() => {
        if (client) {
            handleSetChannel()
        }
    }, [client]);

    if (!client) return <div>loading...</div>

    return (
        <>
            {showAnimation && <Congrats />}

            <Chat client={client} initialNavOpen={false} theme='str-chat__theme-dark'>
                {channel && <Channel channel={channel}>
                    <Window>
                        <div>
                            <ChatChannelHeader conversation={chat!} />
                        </div>
                        <MessageList />
                        <MessageInput grow />
                    </Window>
                    <Thread />
                </Channel>}
            </Chat>
        </>
    )
}

export default function ChatDetail({ params }: { params: { token: string } }) {
    let { token } = params

    return (
        <div className='h-screen'>
            <AuthenticatedApp
                channelId={token}
                userId='8589934649'
                token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODU4OTkzNDY0OSJ9.QZGPWzOL3ZmF2-tfcYILJMgQpmR_6r8bxhN1Prg3ZfA' />
        </div>
    )
}
