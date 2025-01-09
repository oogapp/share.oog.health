'use client'
import { OpenEvidenceReference } from "@/gql/graphql";
import { createRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import List from "./icons/List";
import { Button } from "./ui/button";

export default function CitationList({ citations, onSelect }: { citations: OpenEvidenceReference[], onSelect: (citation: OpenEvidenceReference) => void }) {
    return (
        <div className='space-y-4'>
            <div className=' gap-x-2'>
                <Button className='text-white !text-left bg-black stroke-white inline-flex w-auto !px-0' variant={'sparkyv2'}>
                    <List className="w-5 h-5" />
                    <div>References</div>
                </Button>
                {/*<Button variant={'sparkyv2'}>
                        <Video className="w-5 h-5" />
                        <div>Videos</div>
                    </Button>*/}
            </div>
            <div className='space-y-4'>
                <TransitionGroup>
                    {citations?.sort((a, b) => {
                        return a.citationKey - b.citationKey
                    })?.map((citation, index) => {
                        const itemRef = createRef<any>();
                        return (
                            <CSSTransition nodeRef={itemRef} key={index} timeout={250} classNames="fade-in">
                                <div
                                    ref={itemRef}
                                    onClick={() => {
                                        onSelect(citation)
                                    }}
                                    className='flex cursor-pointer bg-black/30 gap-x-2 align-top p-2 my-2 rounded-xl border border-[#262626]'>
                                    <div className=''>
                                        <div className='bg-brand/20 text-brand p-0.5 rounded-full text-xs min-w-4 max-w-8 inline-flex items-center justify-center'>
                                            {citation?.citationKey}
                                        </div>
                                    </div>
                                    <div className='space-y-1 flex-1'>
                                        <div className='text-sm text-white'>{citation.referenceDetail?.title}</div>
                                        <div className='text-xs text-gray-500'>{citation.referenceDetail?.journalName}</div>
                                    </div>
                                </div>
                            </CSSTransition>
                        )
                    })}
                </TransitionGroup>

                {/*showAllCitations ?
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
                    */}

            </div>
        </div>
    )
}
