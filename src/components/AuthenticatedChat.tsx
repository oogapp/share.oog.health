'use client'
import { getChatByToken } from '@/api/chats';
import Congrats from '@/components/Congrats';
import { CustomTypingIndicator } from '@/components/CustomTypingIndicator';
import { MessageSimple } from '@/components/Message';
import {
    Drawer,
    DrawerContent,
    DrawerHeader
} from "@/components/ui/drawer";
import { OpenEvidenceReference, OpenGraphReference, SparkyConversation } from '@/gql/graphql';
import useOnClickOutside from '@/lib/use-clickoutside';
import { MessageVariant } from '@/lib/utils';
import { ClockIcon } from 'lucide-react';
import { motion } from "motion/react";
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    Channel,
    Chat,
    DefaultStreamChatGenerics,
    MessageInput,
    MessageList,
    MessageRenderer,
    Window,
    defaultRenderMessages,
    useChannelStateContext,
    useChatContext,
    useCreateChatClient,
    useMessageListContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import Citation from './Citation';
import Ai from './icons/Ai';
import Pencil from './icons/Pencil';
import { useKeyboardOpenContext } from './KeyboardOpenProvider';
import { MessageSimpleV2 } from './MessageV2';
import PreviousSearches from './PreviousSearches';
import Reference from './Reference';
import { SendButton } from './SendButton';

const customRenderText = (text: string) => {
    text = text.replaceAll("\\_", '');
    text = text.replaceAll(/\[\[/g, '[');
    text = text.replaceAll(")]", ")")
    return text
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
            <div className='text-sm text-white'>{thinkingLabel}</div>
        </div>
    )
}

function EmptyStateIndicator() {

    const { channel } = useChannelStateContext();

    const suggestions = [
        { id: 1, text: 'What are health risks associated with GLP-1 Receptor agoinsts like Ozempic and Mounjaro?' },
        { id: 2, text: 'What is the treatment of choice for necrotizing fasciitis in pediatrics?' },
        { id: 3, text: 'Is there a connection between testosterone and the risk for myocardial infraction or all -cause morality?' },
    ]

    async function sendMessage(text: string) {
        await channel.sendMessage({ text });
    }

    const { isOpen } = useKeyboardOpenContext()

    return (
        <div className="space-y-1 p-5 relative h-full">

            <motion.div
                initial={{ opacity: 0, }}
                animate={{ opacity: 1, }}
                transition={{ duration: 0.5 }}
            >
                <div className='flex gap-x-4'>
                    <div>
                        <Ai className='w-12 h-12' />
                    </div>
                    <div>
                        <div className='text-3xl'>OOGpt</div>
                        <div className='text-3xl bg-gradient-to-r from-white to-gray-100 font-thin inline-block text-transparent bg-clip-text'>Medical Search</div>
                    </div>
                </div>
            </motion.div>

            {!isOpen && <div className='absolute bottom-0 right-0 left-0 py-6 space-y-4 p-5'>
                <div className='text-right text-gray-400 text-sm'>Try Asking...</div>
                <div className='flex flex-col space-y-2'>

                    <div>
                        {suggestions.map((suggestion, i) => (
                            <motion.div
                                initial={{ opacity: 0, }}
                                animate={{ opacity: 1, }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                key={suggestion.id}
                                onClick={() => sendMessage(suggestion.text)}
                                className='w-4/5 cursor-pointer bg-white/10 ml-auto p-2 rounded-lg text-sm pr-6 text-gray-200 my-2'>
                                {suggestion.text}
                            </motion.div>
                        ))}
                    </div>


                </div>
            </div>}
        </div>
    )
}

const customRenderMessages: MessageRenderer<DefaultStreamChatGenerics> = (options) => {
    const elements = defaultRenderMessages(options);
    //elements.push(<SparkyThinking key={'sparky_thinking'} />);
    return elements;
};

function CustomMessageList({ messageVariant }: { messageVariant: MessageVariant }) {

    let messageComponent = MessageSimple
    if (messageVariant == MessageVariant.V2) {
        messageComponent = MessageSimpleV2
    }

    return (
        <MessageList
            disableDateSeparator={true}
            hideNewMessageSeparator={true}
            UnreadMessagesSeparator={<></>}
            messageActions={[]}
            // @ts-ignore
            renderText={customRenderText}
            Message={messageComponent}
            renderMessages={customRenderMessages} >

        </MessageList>
    )
}



export default function AuthenticatedChat({ userId, token, channelId, apiKey, messageVariant = MessageVariant.V1 }: { userId: string, token: string, channelId: string, apiKey: string, messageVariant: MessageVariant }) {

    const [chat, setChat] = useState<SparkyConversation | null>(null);
    const [showAnimation, setShowAnimation] = useState(false)
    const [citation, setCitation] = useState<OpenEvidenceReference | null>(null)
    const [ogCitation, setOgCitation] = useState<OpenGraphReference | null>(null)
    const [showOgCitation, setShowOgCitation] = useState(false)
    const [showCitation, setShowCitation] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const { setOpen } = useKeyboardOpenContext()

    const ref = useRef<any>()
    useOnClickOutside(ref, () => {
        /*
        let textarea = document.querySelector('textarea') as HTMLTextAreaElement
        textarea.blur()

        let target = document.querySelector('#str-chat__channel') as HTMLElement
        enableBodyScroll(target)*/
    })

    useEffect(() => {
        if (channelId) {
            async function fetchChat() {
                let channel = await getChatByToken(channelId);
                setChat(channel)
            }
            fetchChat()
        }
    }, [channelId]);

    const hasEarnedCredits = useMemo(() => {
        return chat?.educationCredit?.id != null
    }, [chat])

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
                    if (event.type == "notification.mark_read") {
                        client.markAllRead()
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
            <></>
        )
    }
    return (
        <>

            {/*<div className='absolute top-0 right-0 left-0 z-50 bg-gradient-to-b from-brand to-transparent h-28 outline'>

            </div>*/}

            <div className='absolute flex top-14 right-0 left-0 z-50 backdrop-blur-sm	'>
                <div className='flex items-center gap-x-4 ml-auto p-4'>
                    <Link href={"/chat"}>
                        <Pencil />
                    </Link>
                    <div className='cursor-pointer' onClick={() => {
                        setShowHistory(true)
                    }}>
                        <ClockIcon />
                    </div>
                </div>
            </div>

            {showAnimation && <Congrats />}

            <Drawer
                open={showHistory}
                onOpenChange={(open) => setShowHistory(open)}
                dismissible={true}>
                <DrawerContent>
                    <DrawerHeader>Search History</DrawerHeader>
                    <PreviousSearches />
                </DrawerContent>
            </Drawer>

            <Drawer
                open={showCitation}
                onOpenChange={(open) => setShowCitation(open)}
                dismissible={true}>
                <DrawerContent>
                    <Citation citation={citation!} />
                </DrawerContent>
            </Drawer>


            <Drawer
                open={showOgCitation}
                onOpenChange={(open) => setShowOgCitation(open)}
                dismissible={true}>
                <DrawerContent>
                    <Reference reference={ogCitation!} />
                </DrawerContent>
            </Drawer>

            <Chat
                client={client}
                initialNavOpen={false}
                theme='str-chat__theme-dark'>
                {channel &&
                    <Channel
                        EmptyStateIndicator={EmptyStateIndicator}
                        SendButton={SendButton}
                        TypingIndicator={CustomTypingIndicator}
                        channel={channel}>
                        <Window>
                            <CustomMessageList messageVariant={messageVariant} />
                            {!hasEarnedCredits &&
                                <div className='relative overflow-hidden'>
                                    <div
                                        ref={ref}
                                        className='p-3 relative pb-6 rounded-t-xl'>
                                        <Ai className='absolute left-8 top-6 z-10' />
                                        <MessageInput
                                            additionalTextareaProps={{
                                                placeholder: 'Ask me anything',
                                                onFocus: () => {
                                                    setOpen(true)
                                                    setTimeout(() => {
                                                        document.querySelector(".str-chat__list")?.scrollTo({ top: 9999999, behavior: 'smooth' })
                                                    }, 500)
                                                },
                                                onBlur: () => {
                                                    setOpen(false)
                                                },
                                            }}
                                            grow />

                                    </div>
                                </div>
                            }
                        </Window>
                    </Channel>
                }
            </Chat>
        </>
    )
}
