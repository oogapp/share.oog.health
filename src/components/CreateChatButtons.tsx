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
            <div className=" text-white text-center text-xs">
                Chat with...
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Button disabled={loading} onClick={() => {
                    handleCreateChat(ConversationModel.Perplexity)
                }}>
                    A
                </Button>

                <Button disabled={loading} onClick={
                    () => {
                        handleCreateChat(ConversationModel.OpenEvidence)
                    }
                }>
                    B
                </Button>

                <Button disabled={loading} onClick={
                    () => {
                        handleCreateChat(ConversationModel.ChatGpt)
                    }}>
                    C
                </Button>
            </div>
        </div>
    )
}