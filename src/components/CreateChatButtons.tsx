'use client'
import { adminCreateChat } from "@/api/chats";
import { ConversationModel } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";


export default function CreateChatButtons() {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleCreateChat(model: ConversationModel) {
        setLoading(true);
        let channelId = await adminCreateChat(model);
        setLoading(false);
        router.push(`/chat/${channelId}`);
    }

    return (
        <div className="space-y-4">
            <div>
                {/*<Button disabled={loading} onClick={() => {
                    handleCreateChat(ConversationModel.Perplexity)
                }}>
                    A
                </Button>*/}

                <Button disabled={loading} onClick={
                    () => {
                        handleCreateChat(ConversationModel.OpenEvidence)
                    }
                }>
                    Ask Anything
                </Button>

                {/*<Button disabled={loading} onClick={
                    () => {
                        handleCreateChat(ConversationModel.ChatGpt)
                    }}>
                    C
                </Button>*/}
            </div>
        </div>
    )
}
