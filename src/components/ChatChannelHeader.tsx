import { adminCreateChatFromConversation } from "@/api/chats";
import { SparkyConversation } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DefaultStreamChatGenerics, useChannelPreviewInfo, useChannelStateContext } from "stream-chat-react";
import { Button } from "./ui/button";

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


    return (
        <div className="p-3 bg-gray-900 flex items-center">
            <div className="font-bold">{displayTitle}</div>
            <div className="ml-auto">
                {conversation.model != "Reflection" && <Button disabled={loading} onClick={handleCreateChat}>
                    Earn CE
                </Button>}
            </div>
        </div>
    )
}
