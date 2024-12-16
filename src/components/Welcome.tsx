'use client'

import { createChat } from "@/api/chats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConversationModel } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Welcome() {

    const router = useRouter();
    const [initialMessage, setInitialMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    async function submit() {
        setLoading(true)
        let channelId = await createChat(ConversationModel.OpenEvidence, initialMessage)
        router.push(`/chat/${channelId}`);
        //setLoading(false)
    }
    return (

        <div className="space-y-6 p-5">

            <div className="space-y-4">
                <div className="flex items-center gap-x-4">
                    <img src="/oog_brain.svg" className="h-12" />
                    <div className="text-3xl font-title">Welcome to OOGpt! </div>
                </div>
                <div className="space-y-4">
                    <p>Ask any medical question, and we’ll provide clinically accurate responses supported by peer-reviewed journal references.</p>
                    <p>You can also earn Continuing Education (CE) credits as you learn.</p>
                </div>
            </div>

            <div className="space-y-4">
                <Input
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                    placeholder="Ask anything" />

                <Button disabled={loading || initialMessage == ""} onClick={submit}>Ask</Button>
            </div>

        </div>

    )
}
