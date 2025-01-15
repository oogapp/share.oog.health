'use client'
import { flagMessageAsHelpful, flagMessageAsNotHelpful, getMessageByStreamID, reflectOnConversation } from '@/api/chats';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";
import { OpenEvidenceReference, OpenGraphReference, SparkyMessage } from '@/gql/graphql';
import { trackAnalytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ListIcon, ShareIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import {
    renderText,
    useChatContext,
    useMessageContext,
    useTranslationContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import Citation from './Citation';
import CitationList from './CitationList';
import { useCurrentUser } from './CurrentUserContext';
import Reference from './Reference';


const customRenderText = (text: string) => {
    text = text.replaceAll("\\_", '');
    text = text.replaceAll(/\[\[/g, '[');
    text = text.replaceAll(")]", ")")
    return renderText(text)
};

export const MessageFooter = ({ showCitationKey }: { showCitationKey: number | null }) => {
    const [showCitation, setShowCitation] = useState(false)
    const [showReference, setShowReference] = useState(false)

    const [messageCompleted, setMessageCompleted] = useState(false)
    const [citation, setCitation] = useState<OpenEvidenceReference | null>(null)
    const [openGraphReference, setOpenGraphReference] = useState<OpenGraphReference | null>(null)
    const { client } = useChatContext('MessageSimple');

    const [citationsLoading, setCitationsLoading] = useState(false)
    const [citationsLoaded, setCitationsLoaded] = useState(false)
    const [citations, setCitations] = useState<OpenEvidenceReference[]>([])
    const [openGraphReferences, setOpenGraphReferences] = useState<OpenGraphReference[]>([])
    const { message } = useMessageContext("CustomMessageStatus");
    const { t } = useTranslationContext("CustomMessageStatus");
    const [sparkyMessage, setSparkyMessage] = useState<SparkyMessage | null>(null)
    const [showAllCitations, setShowAllCitations] = useState(true)
    const [convertedToReflection, setConvertedToReflection] = useState(false)
    const { user: currentUser } = useCurrentUser()


    const handleEvent = (event: any) => {
        if (event.type == "add_citation") {
            if (event.message_id == message.id) {
                let citationKey = event.citation_key
                let citation = {
                    citationKey: citationKey,
                    referenceDetail: {
                        title: event.citation_title,
                        journalName: event.citation_journal_name,
                    }
                } as OpenEvidenceReference
                // does this citation already exist?
                let exists = citations.find(c => c.citationKey == citationKey)
                if (!exists) {
                    setCitations([...citations, citation])
                }
            }
        }
        if (event.type == "citations_complete") {
            loadCitations()
            setMessageCompleted(true)
            trackAnalytics("Medical Search - Messaging - Search - Answered", {
                userId: currentUser.id,
                query: message.text,
            })
        }
    }

    useEffect(() => {
        client.on(handleEvent);
        return () => client.off(handleEvent);
    }, [client, handleEvent]);

    const totalCitations = useMemo(() => {
        return citations?.length
    }, [citations])

    const totalReferences = useMemo(() => {
        return openGraphReferences?.length
    }, [openGraphReferences])

    useEffect(() => {
        if (showCitationKey) {
            let citation = citations.find(c => c.citationKey == showCitationKey)
            if (citation) {
                setCitation(citation)
                setShowCitation(true)
            }
        }
    }, [showCitationKey])

    async function loadCitations() {
        try {
            setCitationsLoading(true)
            let sm = await getMessageByStreamID(message.id);
            setSparkyMessage(sm)
            setCitationsLoading(false)
            if (sm) {
                setCitations(sm.references!)
                setOpenGraphReferences(sm.opengraphReferences!)
            } else {
                setCitations([])
            }
            setCitationsLoaded(true)
        } catch (e) {
            console.log("error=", e)
        }

    }

    async function handleConvertToCE() {
        trackAnalytics("Medical Search - CE - Tapped", {
            userId: currentUser.id,
            messageId: sparkyMessage?.id!,
            conversationId: sparkyMessage?.conversation?.id!,
        })
        setConvertedToReflection(true)
        await reflectOnConversation(sparkyMessage?.conversation?.id!)
        // scroll to bottom of window
        setTimeout(() => {
            document.querySelector(".str-chat__list")?.scrollTo({ top: 9999999, behavior: 'smooth' })
        }, 500)
    }

    async function handleNotHelpful() {
        trackAnalytics("Medical Search - Not Helpful - Tapped", {
            userId: currentUser.id,
            messageId: sparkyMessage?.id!,
            conversationId: sparkyMessage?.conversation?.id!,
        })
        await flagMessageAsNotHelpful(sparkyMessage?.id!)
        loadCitations()
    }

    async function handleHelpful() {
        trackAnalytics("Medical Search - Helpful - Tapped", {
            userId: currentUser.id,
            messageId: sparkyMessage?.id!,
            conversationId: sparkyMessage?.conversation?.id!,
        })
        await flagMessageAsHelpful(sparkyMessage?.id!)
        loadCitations()
    }


    useEffect(() => {

        if (citationsLoaded || citationsLoading) return
        if (message) {
            console.log("is_streaming=", message?.is_streaming)
            loadCitations()
        }
        if (message && !message.is_streaming) {
            console.log("streaming has ended")
            setMessageCompleted(true)
        }
    }, [message, citationsLoaded, citationsLoading])

    if (message.user?.id != "sparky_reflection_bot_v1") {
        return null
    }

    if (convertedToReflection || sparkyMessage?.conversation?.convertedFromModel == "OpenEvidence") {
        return null
    }

    return (
        <div className='space-y-4 my-3 w-full border-gray-600 w-full space-y-8'>

            {messageCompleted &&
                <motion.div
                    className="mt-8 flex !gap-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        onClick={() => {
                            let cid = message.cid
                            let token = cid!.split(":")[1]
                            // show share sheet with web share api
                            if (navigator.share) {
                                navigator.share({
                                    title: 'OOG Medical Search',
                                    text: 'Check out this medical search result',
                                    url: `https://share.oog.health/search/` + token
                                })
                                    .then(() => console.log('Successful share'))
                                    .catch((error) => console.log('Error sharing', error));
                            } else {
                                // fallback
                            }
                        }}
                        disabled={sparkyMessage?.notHelpful}
                        variant={'sparkyv2'} >
                        <ShareIcon className="w-4 h-4" />
                        Share</Button>

                    <Button
                        disabled={sparkyMessage?.notHelpful}
                        onClick={() => {
                            handleHelpful()
                        }}
                        variant={'sparkyv2'} >
                        <ThumbsUp className={cn("w-4 h-4", {
                            'text-green-500': sparkyMessage?.isHelpful
                        })} />
                        Helpful
                    </Button>
                    <Button
                        disabled={sparkyMessage?.isHelpful}
                        onClick={() => {
                            handleNotHelpful()
                        }}
                        variant={'sparkyv2'} >
                        <ThumbsDown className={cn("w-4 h-4", {
                            'text-red-500': sparkyMessage?.notHelpful
                        })} />
                        Not Helpful
                    </Button>
                </motion.div>
            }

            {messageCompleted &&
                <motion.div
                    onClick={() => {
                        handleConvertToCE()
                    }}
                    className='grid grid-cols-2 bg-black/30 text-white border rounded-xl cursor-pointer'>
                    <div className='flex flex-col justify-center'>
                        <div className='p-5'>
                            <div className='text-xl'>Earn 0.5 CE!</div>
                            <div className='text-gray-400 text-xs'>
                                Tap here and tell what you learned.
                            </div>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <div className='relative h-28'>
                            <img src="/confetti.png" />
                            <img className='absolute inset-0 h-36' src="/ce_balloon.png" />
                        </div>
                    </div>
                </motion.div>
            }

            {messageCompleted && <>
                {totalCitations > 0 &&
                    <CitationList
                        onSelect={(citation) => {
                            setCitation(citation)
                            setShowCitation(true)
                        }}
                        citations={citations}
                    />
                }
            </>}

            {totalReferences > 0 && <div className='space-y-4'>
                <div className='flex text-white gap-x-2'>
                    <ListIcon className="w-4 h-4" />
                    <div className='text-xl'>References</div>
                    <div className='ml-auto text-gray-400'>
                        {openGraphReferences?.length} references
                    </div>
                </div>
                <div className='space-y-4'>
                    {openGraphReferences?.slice(0, showAllCitations ? openGraphReferences.length : 3).map((ogReference, index) => {
                        return (
                            <div
                                onClick={() => {
                                    setOpenGraphReference(ogReference)
                                    setShowReference(true)
                                }}
                                key={index} className='flex cursor-pointer gap-x-2 align-top bg-gray-800 text-white p-2 rounded-xl'>
                                <div className=''>
                                    <div className='bg-brand/20 text-brand p-0.5 rounded-full text-xs w-4 h-4 inline-flex items-center justify-center'>
                                        {index + 1}
                                    </div>
                                </div>
                                <div className='space-y-2 '>
                                    <div className='text-sm'>{ogReference?.title || ogReference?.description}</div>
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
            </div>}


            <Drawer
                open={showReference}
                onOpenChange={(open) => setShowReference(open)}
                dismissible={true}>
                <DrawerContent>
                    <Reference reference={openGraphReference!} />
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
        </div>
    );
}
