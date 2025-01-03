'use client'
import { getMessage } from "@/api/chats";
import MedicalSearchText from "@/components/MedicalSearchText";
import { OpenEvidenceReference, SparkyMessage } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Citation from "./Citation";
import CitationList from "./CitationList";
import { Drawer, DrawerContent } from "./ui/drawer";


export default function ShareMessage({ message }: { message: SparkyMessage }) {

    const [showCitation, setShowCitation] = useState(false);
    const [sparkyMessage, setSparkyMessage] = useState<SparkyMessage | null>(null);
    const [citation, setCitation] = useState<OpenEvidenceReference | null>(null);

    const messageBodyRef = useRef<HTMLDivElement | null>(null);

    function handleCitationClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (target.tagName === 'A' && target.classList.contains('!bg-brand/20')) {
            event.preventDefault();
            let citationKey = target.getAttribute('data-citation-key');
            if (citationKey) {
                let c = sparkyMessage?.references?.find((c) => c.citationKey === parseInt(citationKey));
                if (c) {
                    setCitation(c);
                    setShowCitation(true);
                }
            }
        }
    }

    // listen to clicks on the message body to trigger the event
    useEffect(() => {
        if (messageBodyRef.current) {
            messageBodyRef.current.addEventListener('click', handleCitationClick);
        }

        return () => {
            if (messageBodyRef.current) {
                messageBodyRef.current.removeEventListener('click', handleCitationClick);
            }
        };
    }, [messageBodyRef.current]);

    useEffect(() => {
        getMessage(message.id).then((sm) => {
            setSparkyMessage(sm);
        })
    }, [message.id]);


    return (
        <div className={cn("flex p-4 m-4 ", {
            "ml-auto w-4/5 str-chat__message-bubble rounded-lg !bg-white/20 text-white": !message?.sentBySparky
        })}>
            <div className="space-y-6">
                <div ref={messageBodyRef}>
                    <MedicalSearchText text={message.body} />
                </div>
                {sparkyMessage?.references?.length! > 0 &&
                    <CitationList
                        onSelect={(citation) => {
                            setCitation(citation);
                            setShowCitation(true);
                        }}
                        citations={sparkyMessage?.references!} />
                }
            </div>

            <Drawer
                open={showCitation}
                onOpenChange={(open) => setShowCitation(open)}
                dismissible={true}>
                <DrawerContent>
                    <Citation citation={citation!} />
                </DrawerContent>
            </Drawer>
        </div>
    )

}
