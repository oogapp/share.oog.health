'use client'
import { flagMessageAsNotHelpful, getMessageByStreamID, reflectOnConversation } from '@/api/chats';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";
import { OpenEvidenceReference, OpenGraphReference, SparkyMessage } from '@/gql/graphql';
import { cn } from '@/lib/utils';
import { ListIcon, ThumbsDown } from 'lucide-react';
import { createRef, useEffect, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
    renderText,
    useChatContext,
    useMessageContext,
    useTranslationContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import Citation from './Citation';
import Reference from './Reference';


const customRenderText = (text: string) => {
    text = text.replaceAll("\\_", '');
    text = text.replaceAll(/\[\[/g, '[');
    text = text.replaceAll(")]", ")")
    return renderText(text)
};

export const CustomMessageStatus = ({ showCitationKey }: { showCitationKey: number | null }) => {
    const [showCitation, setShowCitation] = useState(false)
    const [showReference, setShowReference] = useState(false)

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
    const [showAllCitations, setShowAllCitations] = useState(false)

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
        await reflectOnConversation(sparkyMessage?.conversation?.id!)
    }

    async function handleNotHelpful() {
        await flagMessageAsNotHelpful(sparkyMessage?.id!)
        loadCitations()
    }


    useEffect(() => {
        if (citationsLoaded || citationsLoading) return
        if (message) {
            loadCitations()
        }
    }, [message, citationsLoaded, citationsLoading])

    if (message.user?.id != "sparky_reflection_bot_v1") {
        return null
    }
    return (
        <div className='space-y-4 my-3 w-full border-t border-gray-600 w-full'>
            <div className="mt-3 flex !gap-x-1">
                {/*<Button
                    disabled={sparkyMessage?.notHelpful}
                    variant={'sparky'} >
                    <ShareIcon className="w-4 h-4" />
                    Share</Button>*/}
                <Button
                    onClick={() => {
                        handleNotHelpful()
                    }}
                    variant={'sparky'} >
                    <ThumbsDown className={cn("w-4 h-4", {
                        'text-red-500': sparkyMessage?.notHelpful
                    })} />
                    Not Helpful
                </Button>
                <Button
                    disabled={sparkyMessage?.notHelpful}
                    onClick={() => {
                        handleConvertToCE()
                    }}
                    variant={'sparky'}>
                    <img src="/ce-bubble.png" className="w-6 h-6" />
                </Button>
            </div>


            {totalCitations > 0 && <div className='space-y-4'>
                <div className='flex items-center text-white gap-x-2'>
                    <ListIcon className="w-4 h-4" />
                    <div className='text-xl'>References</div>
                    <div className='ml-auto text-gray-400'>
                        {citations?.length} references
                    </div>
                </div>
                <div className='space-y-4'>
                    <TransitionGroup>
                        {citations?.sort((a, b) => {
                            return a.citationKey - b.citationKey
                        })?.slice(0, showAllCitations ? citations.length : 3).map((citation, index) => {
                            const itemRef = createRef<any>();
                            return (
                                <CSSTransition nodeRef={itemRef} key={index} timeout={250} classNames="fade-in">
                                    <div
                                        ref={itemRef}
                                        onClick={() => {
                                            setCitation(citation)
                                            setShowCitation(true)
                                        }}
                                        className='flex cursor-pointer gap-x-2 align-top bg-gray-800 text-white p-2 my-2 rounded-xl'>
                                        <div className=''>
                                            <div className='bg-brand/20 text-brand p-0.5 rounded-full text-xs w-4 h-4 inline-flex items-center justify-center'>
                                                {citation?.citationKey}
                                            </div>
                                        </div>
                                        <div className='space-y-1'>
                                            <div className='text-sm'>{citation.referenceDetail?.title}</div>
                                            <div className='text-sm text-gray-400'>{citation.referenceDetail?.journalName}</div>
                                        </div>
                                    </div>
                                </CSSTransition>
                            )
                        })}
                    </TransitionGroup>

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

            {totalReferences > 0 && <div className='space-y-4'>
                <div className='flex items-center text-white gap-x-2'>
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
