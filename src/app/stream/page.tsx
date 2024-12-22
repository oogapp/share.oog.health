'use client'
import { createChat } from '@/api/chats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConversationModel, MedicalSearchEvent, OpenEvidenceReference } from '@/gql/graphql';
import { cn } from '@/lib/utils';
import { createClient } from 'graphql-ws';
import { ListIcon, ShareIcon, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createRef, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const wssEndpoint = process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT!.replace("https", "wss")

const client = createClient({
    url: wssEndpoint,
    connectionParams: async () => {
        return {}
    }
});

interface CitationMap {
    [key: string]: OpenEvidenceReference
}

function CitationLinK({ text, onClick }: { text: string, onClick: (key: number) => void }) {
    text = text.substring(2, text.length - 2)
    let key = parseInt(text)
    return (
        <span className='!bg-brand/20 !text-brand mr-1 p-0.5 rounded-full text-xs min-w-4 max-w-6 h-4 inline-flex items-center justify-center cursor-pointer' onClick={() => {
            onClick(key)
        }}>{text}</span>
    )
}

function CitationsFromMap({ citationsMap }: { citationsMap: CitationMap }) {
    let citations = Object.entries(citationsMap)
    let totalCitations = citations.length
    if (totalCitations == 0) {
        return null
    }
    return (
        <div className='space-y-2'>

            <div className='flex items-center text-white gap-x-2'>
                <ListIcon className="w-4 h-4" />
                <div className='text-xl'>References</div>
                <div className='ml-auto text-gray-400'>
                    {totalCitations} references
                </div>
            </div>

            <TransitionGroup>
                {citations.map(([key, citation]) => {
                    return (
                        <CSSTransition key={key} timeout={250} classNames="fade-in">
                            <div
                                onClick={() => {

                                }}
                                key={key} className='flex items-center cursor-pointer gap-x-2 align-top bg-gray-800 text-white p-2 rounded-xl my-2'>
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
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        </div>
    )
}

export default function StreamPage() {
    const currentSubscription = useRef<any>(null)
    const [wsConnected, setWsConnected] = useState(false)
    const [lines, setLines] = useState<string[]>([])
    const [citationsMap, setCitationsMap] = useState<CitationMap>({})
    const [question, setQuestion] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [chatToken, setChatToken] = useState<string>("")
    const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false)
    const router = useRouter()

    async function handleSubscription() {
        if (chatToken == "") {
            return
        }
        try {

            console.log("setup subscription")
            const subscription = client.iterate({
                query: `subscription MedicalSearch($token: String!) {
                      medicalSearchResponse(token:$token) {
                        text
                            citation {
                            citationKey
                            referenceText
                            referenceDetail {
                                title
                                authorsString
                                publicationInfoString
                                journalName
                                journalShortName
                                publicationDate
                                doi
                                url
                            }
                        }
                    }
                }`,
                variables: {
                    token: chatToken
                }
            });
            setWsConnected(true)
            currentSubscription.current = subscription
            for await (const event of subscription) {
                let resp = event?.data?.medicalSearchResponse as MedicalSearchEvent
                let text = resp?.text!
                setLoadingAnswer(prev => false)
                console.log("text=", text)
                setLines((prev) => [...prev, text])
                if (resp.citation) {
                    let citation = resp.citation
                    if (citation.citationKey != null && citation.citationKey != 0) {
                        setCitationsMap((prev) => {
                            return {
                                ...prev,
                                [citation.citationKey]: citation
                            }
                        })

                    }
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        handleSubscription()
        return () => {
            currentSubscription.current?.return()
        }
    }, [wsConnected, chatToken])

    async function submit() {
        setLoading(true)
        let channelId = await createChat(ConversationModel.OpenEvidence, question)
        setChatToken(channelId.toString())
        setLoading(false)
        setLoadingAnswer(true)
    }

    return (
        <div>

            <div>
                <div className='m-10 space-y-8'>
                    <div className='text-xl space-y-2'>
                        <Input placeholder="Ask a question" value={question} onChange={(e) => {
                            setQuestion(e.target.value)
                        }} />
                        <Button
                            onClick={submit}
                            disabled={loading}>
                            Submit
                        </Button>
                    </div>

                    {chatToken != "" && <>
                        <div>

                            {(loadingAnswer) &&
                                <div>
                                    <div className='flex items-center gap-x-2 my-6 px-3'>
                                        <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <div className='text-sm'>Analyzing Query</div>
                                    </div>
                                </div>
                            }

                            <TransitionGroup>

                                {lines.map((line, index) => {
                                    let el = <span>{line}</span>
                                    if (line == "\n\n") {
                                        //return <p className='my-3' key={index} />
                                        el = <p className='my-3' key={index} />
                                    }
                                    if (line.startsWith("[[")) {
                                        el = (<CitationLinK text={line} onClick={(key) => {
                                            console.log("clicked", key)
                                        }} />)
                                    }
                                    const itemRef = createRef<any>();
                                    return (
                                        <CSSTransition nodeRef={itemRef} key={index} timeout={500} classNames="fade-in">
                                            <span ref={itemRef} className='transition-opacity duration-300' key={index}>{el}</span>
                                        </CSSTransition>
                                    )
                                })}
                            </TransitionGroup>
                        </div>

                        {lines.length > 0 && <div className="mt-3 flex !gap-x-1">
                            <Button
                                disabled={false}
                                variant={'sparky'} >
                                <ShareIcon className="w-4 h-4" />
                                Share</Button>
                            <Button
                                onClick={() => {

                                }}
                                variant={'sparky'} >
                                <ThumbsDown className={cn("w-4 h-4", {

                                })} />
                                Not Helpful
                            </Button>
                            <Button
                                disabled={false}
                                onClick={() => {

                                }}
                                variant={'sparky'}>
                                <img src="/ce-bubble.png" className="w-6 h-6" />
                            </Button>
                        </div>}


                        <div>
                            <CitationsFromMap citationsMap={citationsMap} />
                        </div>

                    </>}
                </div>
            </div>
        </div>
    )
}
