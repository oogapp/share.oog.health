import { adminCreateChatFromConversation } from "@/api/chats";
import { SparkyConversation } from "@/gql/graphql";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DefaultStreamChatGenerics, useChannelPreviewInfo, useChannelStateContext } from "stream-chat-react";
import { Button } from "./ui/button";


function getChatTypeName(model: string) {
    switch (model) {
        case "Perplexity":
            return "A"
        case "OpenEvidence":
            return "B"
        case "ChatGpt":
            return "C"
        case "Reflection":
            return "Reflection"
    }
}


export default function ChatChannelHeader({ conversation }: { conversation: SparkyConversation }) {

    const { channel, watcher_count } = useChannelStateContext<DefaultStreamChatGenerics>('ChannelHeader');
    const { displayImage, displayTitle, groupChannelDisplayInfo } = useChannelPreviewInfo({
        channel,
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleCreateChat() {
        setLoading(true);
        let token = await adminCreateChatFromConversation(conversation.id)
        setLoading(false);
        router.push(`/chat/${token}`);
    }

    const title = getChatTypeName(conversation.model!);


    return (
        <div className="p-3 bg-gray-900 flex items-center">

            <div className="mr-3">
                <Link href={`/chat`} className="">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
            </div>

            <div className="font-bold">{title}</div>
            <div className="ml-auto">
                {conversation.model != "Reflection" && <Button disabled={loading} onClick={handleCreateChat}>
                    Earn CE
                </Button>}
            </div>
        </div>
    )
}
