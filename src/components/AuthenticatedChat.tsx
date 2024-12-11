'use client'
import { getChatByToken, getMessage } from '@/api/chats';
import ChatChannelHeader from '@/components/ChatChannelHeader';
import Congrats from '@/components/Congrats';
import { CustomTypingIndicator } from '@/components/CustomTypingIndicator';
import { MessageSimple } from '@/components/Message';
import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";
import { Skeleton } from '@/components/ui/skeleton';
import { OpenEvidenceReference, OpenGraphReference, SparkyConversation } from '@/gql/graphql';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Channel,
    Chat,
    DefaultStreamChatGenerics,
    MessageInput,
    MessageList,
    MessageRenderer,
    Window,
    defaultRenderMessages,
    renderText,
    useChatContext,
    useCreateChatClient,
    useMessageListContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import Citation from './Citation';


const customRenderText = (text: string) => {
    text = text.replaceAll("\\_", '');
    text = text.replaceAll(/\[\[/g, '[');
    text = text.replaceAll(")]", ")")
    return renderText(text)
};

function SparkyThinking() {
    const { client } = useChatContext();
    const [show, setShow] = useState(false)
    const { listElement, scrollToBottom } = useMessageListContext();
    const [thinkingLabel, setThinkingLabel] = useState('Analyzing query...')

    useLayoutEffect(() => {
        scrollToBottom()
    }, [show])

    useEffect(() => {
        const handleEvent = (event: any) => {
            if (event.type == "sparky_thinking_start") {
                if (event.label) {
                    setThinkingLabel(event.label)
                }
                setShow(true)
            }
            if (event.type == "sparky_thinking_stop") {
                setShow(false)
            }
        }
        client.on(handleEvent);
        return () => client.off(handleEvent);
    }, [client]);

    if (!show) return null;

    return (
        <div className='flex items-center gap-x-2 my-6 px-3'>
            <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className='text-sm'>{thinkingLabel}</div>
        </div>
    )
}

function EmptyStateIndicator() {
    return (
        <div className="space-y-2 p-5">
            <img src="/oog_brain.svg" className="h-32 mx-auto" />
            <div className="text-3xl font-title">Welcome to OOGpt! </div>
            <div className="space-y-4">
                <p>Ask any medical question, and we’ll provide clinically accurate responses supported by peer-reviewed journal references.</p>
                <p>You can also earn Continuing Education (CE) credits as you learn.</p>
                <p>We’re continuously fine-tuning our platform, so please let us know if a response is ‘helpful’ or ‘not helpful’—your feedback makes us better!</p>
            </div>
        </div>
    )
}

const customRenderMessages: MessageRenderer<DefaultStreamChatGenerics> = (options) => {
    const elements = defaultRenderMessages(options);
    if (elements.length == 0) {
        elements.push(<EmptyStateIndicator key='empty-indicator' />);
    }
    elements.push(<SparkyThinking key={'sparky_thinking'} />);
    return elements;
};

const CustomMessageList = () => (
    <>
        <MessageList
            disableDateSeparator={true}
            hideNewMessageSeparator={true}
            messageActions={[]}
            // @ts-ignore
            renderText={customRenderText}
            Message={MessageSimple}
            renderMessages={customRenderMessages} >
        </MessageList>
    </>
);

export default function AuthenticatedChat({ userId, token, channelId, apiKey }: { userId: string, token: string, channelId: string, apiKey: string }) {

    const [chat, setChat] = useState<SparkyConversation | null>(null);
    const [showAnimation, setShowAnimation] = useState(false)
    const [citation, setCitation] = useState<OpenEvidenceReference | null>(null)
    const [ogCitation, setOgCitation] = useState<OpenGraphReference | null>(null)
    const [showOgCitation, setShowOgCitation] = useState(false)
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
        apiKey: apiKey,
        tokenOrProvider: token,
        userData: { id: userId },
    });

    const [channel, setChannel] = useState<any | null>(null);

    async function handleSetChannel() {
        if (client) {
            let channels = await client.queryChannels({ type: 'reflection_v1', id: { $in: [channelId] } });
            //@ts-ignore
            let chan = channels[0];
            if (chan) {
                chan.on(event => {
                    //@ts-ignore
                    if (event.type == "ce_credit_earned") {
                        setShowAnimation(true)
                    }
                })
                setChannel(chan)
            } else {
                console.log("no channel found")
            }
        }
    }

    useEffect(() => {
        if (client) {
            handleSetChannel()
        }
    }, [client]);

    if (!client) {
        // generate a skeleton chat/avatar list using the Skeleton component
        return (
            <div className='h-dvh p-5 space-y-8'>
                <div className="flex space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-32 w-[250px]" />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="space-y-2">
                        <Skeleton className="h-32 w-[250px]" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <div className="flex space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-32 w-[250px]" />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='h-dvh'>
            {showAnimation && <Congrats />}

            <Drawer
                open={showCitation}
                onOpenChange={(open) => setShowCitation(open)}
                dismissible={true}>
                <DrawerContent>
                    <Citation citation={citation!} />
                </DrawerContent>
            </Drawer>

            <Chat
                client={client}
                initialNavOpen={false}
                theme='str-chat__theme-dark'>
                {channel &&
                    <Channel
                        TypingIndicator={CustomTypingIndicator}
                        channel={channel}>
                        <Window>
                            <div className='hidden'>
                                <ChatChannelHeader conversation={chat!} />
                            </div>
                            <CustomMessageList />
                            <MessageInput
                                additionalTextareaProps={{ placeholder: 'Ask me anything' }}
                                grow />
                        </Window>
                    </Channel>
                }
            </Chat>
        </div>
    )
}
