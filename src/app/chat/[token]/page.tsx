'use client'
import { getChatByToken, getMessage } from '@/api/chats';
import ChatChannelHeader from '@/components/ChatChannelHeader';
import Congrats from '@/components/Congrats';
import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";
import { Label } from '@/components/ui/label';
import { OpenEvidenceReference, SparkyConversation } from '@/gql/graphql';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
    renderText,
    useCreateChatClient
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';


const customRenderText = (text: string) => {

    console.log("before=", text)

    text = text.replaceAll("\\_", '');

    text = text.replaceAll(/\[\[/g, '[');
    // now remove the last close square bracket, which follows a closed parenthesis
    text = text.replaceAll(")]", ")")

    console.log("after=", text)



    return renderText(text)
};

function AuthenticatedApp({ userId, token, channelId }: { userId: string, token: string, channelId: string }) {

    const [chat, setChat] = useState<SparkyConversation | null>(null);
    const [showAnimation, setShowAnimation] = useState(false)
    const [citation, setCitation] = useState<OpenEvidenceReference | null>(null)
    const [showCitation, setShowCitation] = useState(false)

    useEffect(() => {
        if (channelId) {
            async function fetchChat() {
                let channel = await getChatByToken(channelId);
                setChat(channel)
            }
            fetchChat()
        }
    }, [channelId]);

    async function handleCitation(id: string, key: number) {
        let message = await getMessage(id);
        if (message) {
            let citation = message.references?.find((ref: OpenEvidenceReference) => ref.citationKey == key);
            if (citation) {
                setCitation(citation)
                setShowCitation(true)
            }
        }
    }


    // intercept all clicks on str-chat__message-url-link
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('str-chat__message-url-link')) {
                e.preventDefault();
                let href = target.getAttribute('href');
                // https://admin.oog.health/citations/193273530232/6
                // extract the last two numbers, as messageId and citationKey
                let parts = href?.split('/');
                let messageId = parts?.[parts.length - 2];
                let citationKey = parts?.[parts.length - 1];
                if (messageId && citationKey) {
                    handleCitation(messageId, parseInt(citationKey));
                }
            }
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [])


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
        <div className='h-dvh'>
            {showAnimation && <Congrats />}

            <Drawer
                open={showCitation}
                onOpenChange={(open) => setShowCitation(open)}
                dismissible={true}>
                <DrawerContent>
                    {citation && <div className="flex p-3">
                        <div className="border-b border-gray-600 space-y-1">
                            <div>
                                <Link className="underline font-bold" target="new" href={citation.referenceDetail.url}>
                                    {citation?.referenceDetail?.title}
                                </Link>
                            </div>
                            <div className="text-sm">
                                {citation?.referenceDetail?.authorsString}
                            </div>
                            <div className="text-sm">
                                {citation?.referenceDetail?.publicationInfoString}
                            </div>
                            <div>
                                <Label>Source Texts</Label>
                                <div className="text-sm overflow-x-scroll h-64">
                                    {citation.sourceTexts}
                                </div>
                            </div>
                        </div>
                    </div>}
                </DrawerContent>
            </Drawer>

            <Chat client={client} initialNavOpen={false} theme='str-chat__theme-dark'>
                {channel && <Channel channel={channel}>
                    <Window>
                        <div>
                            <ChatChannelHeader conversation={chat!} />
                        </div>
                        <MessageList
                            // @ts-ignore
                            renderText={customRenderText}
                        />
                        <MessageInput grow />
                    </Window>
                    <Thread />
                </Channel>}
            </Chat>
        </div>
    )
}

export default function ChatDetail({ params }: { params: { token: string } }) {
    let { token } = params

    return (
        <div className='h-dvh'>
            <AuthenticatedApp
                channelId={token}
                userId='8589934649'
                token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODU4OTkzNDY0OSJ9.QZGPWzOL3ZmF2-tfcYILJMgQpmR_6r8bxhN1Prg3ZfA' />
        </div>
    )
}
