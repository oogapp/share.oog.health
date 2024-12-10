'use client'

import { createChat } from "@/api/chats";
import { ConversationModel } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Chat() {

    const router = useRouter();

    async function init() {
        let channelId = await createChat(ConversationModel.OpenEvidence);
        router.push(`/chat/${channelId}`);
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div>
            <div className="outline h-screen flex items-center justify-center">
                <img src="/oog_brain.svg" className="h-32 mx-auto animate-ping" />
            </div>
        </div>
    )
}
