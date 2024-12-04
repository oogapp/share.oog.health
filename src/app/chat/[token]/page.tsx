'use client'
import { getChatByToken, getMessage, getMessageByStreamID, reflectOnConversation } from '@/api/chats';
import ChatChannelHeader from '@/components/ChatChannelHeader';
import Congrats from '@/components/Congrats';
import { MessageSimple } from '@/components/Message';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";
import { Label } from '@/components/ui/label';
import { OpenEvidenceReference, OpenGraphReference, SparkyConversation, SparkyMessage } from '@/gql/graphql';
import { ListIcon, ShareIcon, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
    defaultRenderMessages,
    renderText,
    useCreateChatClient,
    useMessageContext,
    useTranslationContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';


const customRenderText = (text: string) => {
    text = text.replaceAll("\\_", '');
    text = text.replaceAll(/\[\[/g, '[');
    text = text.replaceAll(")]", ")")
    return renderText(text)
};

const CustomMessageStatus = () => {
    const [showCitation, setShowCitation] = useState(false)
    const [citation, setCitation] = useState<OpenEvidenceReference | null>(null)
    const [citationsLoading, setCitationsLoading] = useState(false)
    const [citationsLoaded, setCitationsLoaded] = useState(false)
    const [citations, setCitations] = useState<OpenEvidenceReference[]>([])
    const { message } = useMessageContext("CustomMessageStatus");
    const { t } = useTranslationContext("CustomMessageStatus");
    const [sparkyMessage, setSparkyMessage] = useState<SparkyMessage | null>(null)
    const [showAllCitations, setShowAllCitations] = useState(false)

    async function loadCitations() {
        try {
            setCitationsLoading(true)
            let sm = await getMessageByStreamID(message.id);
            setSparkyMessage(sm)
            setCitationsLoading(false)
            if (sm) {
                setCitations(sm.references!)
            } else {
                setCitations([])
            }
            setCitationsLoaded(true)
        } catch (e) {
            console.log("error=", e)
        }

    }

    async function handleConvertToCE() {
        await reflectOnConversation(sparkyMessage?.conversation?.id!)
    }

    useEffect(() => {
        if (citationsLoaded || citationsLoading) return
        if (message) {
            console.log("message=", message)
            loadCitations()
        }
    }, [message, citationsLoaded, citationsLoading])

    if (message.user?.id != "sparky_reflection_bot_v1") {
        return null
    }
    return (
        <div className='space-y-4 my-3 w-full border-t border-gray-600 w-full'>
            <div className="mt-3 flex !gap-x-2">
                <Button variant={'sparky'} size='sm'>
                    <ShareIcon className="w-4 h-4" />
                    Share</Button>
                <Button variant={'sparky'} size='sm'>
                    <ThumbsDown className="w-4 h-4" />
                    Not Helpful</Button>
                <Button
                    onClick={() => {
                        handleConvertToCE()
                    }}
                    variant={'sparky'} size='sm'>
                    <img src="/ce-bubble.png" className="w-6 h-6" />
                </Button>
            </div>
            <div className='space-y-4'>
                <div className='flex items-center text-white gap-x-2'>
                    <ListIcon className="w-4 h-4" />
                    <div className='text-xl'>References</div>
                    <div className='ml-auto text-gray-400'>
                        {citations?.length} references
                    </div>
                </div>
                <div className='space-y-4'>
                    {citations?.slice(0, showAllCitations ? citations.length : 3).map((citation, index) => {
                        return (
                            <div
                                onClick={() => {
                                    setCitation(citation)
                                    setShowCitation(true)
                                }}
                                key={index} className='flex cursor-pointer gap-x-2 align-top bg-gray-800 text-white p-2 rounded-xl'>
                                <div className=''>
                                    <div className='bg-brand/20 text-brand p-0.5 rounded-full text-xs w-4 h-4 inline-flex items-center justify-center'>
                                        {citation?.citationKey}
                                    </div>
                                </div>
                                <div className='space-y-2 '>
                                    <div className='text-sm'>{citation.referenceDetail?.title}</div>
                                    <div className='text-xs text-gray-400 hidden'>{citation.referenceDetail?.publicationInfoString}</div>
                                </div>
                            </div>
                        )
                    })}

                    {showAllCitations ?
                        <div
                            onClick={() => setShowAllCitations(false)}
                            className='flex text-white underline justify-center'>
                            Show Less
                        </div> :
                        <div
                            onClick={() => setShowAllCitations(true)}
                            className='flex  text-white underline justify-center'>
                            Show All References
                        </div>
                    }

                </div>
            </div>


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
                            <div className="text-sm ">
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
        </div>
    );
}

function AuthenticatedApp({ userId, token, channelId }: { userId: string, token: string, channelId: string }) {

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
                {channel && <Channel
                    MessageStatus={CustomMessageStatus}
                    channel={channel}>
                    <Window>
                        <div className=''>
                            <ChatChannelHeader conversation={chat!} />
                        </div>
                        <MessageList
                            disableDateSeparator={true}
                            hideNewMessageSeparator={true}
                            // @ts-ignore
                            renderText={customRenderText}
                            Message={MessageSimple}
                            renderMessages={(params) => {

                                let customClasses = {
                                    message: "sparky__message",
                                }
                                //params.customClasses = customClasses


                                return defaultRenderMessages(params)
                            }}
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
