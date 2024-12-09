'use client'
import { flagMessageAsNotHelpful, getMessageByStreamID, reflectOnConversation } from '@/api/chats';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";
import { Label } from '@/components/ui/label';
import { OpenEvidenceReference, SparkyMessage } from '@/gql/graphql';
import { cn } from '@/lib/utils';
import { ListIcon, ShareIcon, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    renderText,
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

export const CustomMessageStatus = () => {
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
            <div className="mt-3 flex !gap-x-2">
                <Button
                    disabled={sparkyMessage?.notHelpful}
                    variant={'sparky'} size='sm'>
                    <ShareIcon className="w-4 h-4" />
                    Share</Button>
                <Button
                    onClick={() => {
                        handleNotHelpful()
                    }}
                    variant={'sparky'} size='sm'>
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
