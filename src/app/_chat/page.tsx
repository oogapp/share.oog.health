import { getChats } from "@/api/chats";
import CreateChatButtons from "@/components/CreateChatButtons";
import { SparkyConversation } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export const dynamic = "force-dynamic";

function getChatTypeName(model: string) {
    switch (model) {
        case "Perplexity":
            return "A"
        case "OpenEvidence":
            return "Medical Search"
        case "ChatGPT":
            return "C"
        case "Reflection":
            return "Reflection"
    }
}

export default function PostChat({ params }: { params: { id: string } }) {

    let chats = use(getChats())


    return (
        <div className="space-y-4">

            <div className="p-3 sticky flex flex-col justify-between top-0 z-10 space-y-4 h-screen">
                <div className="space-y-2">
                    <img src="/oog_brain.svg" className="h-32 mx-auto" />
                    <div className="text-3xl font-title">Welcome! </div>
                    <div className="space-y-4">
                        <p>Ask any medical question, and we’ll provide clinically accurate responses supported by peer-reviewed journal references.</p>
                        <p>You can also earn Continuing Education (CE) credits as you learn.</p>
                        <p>We’re continuously fine-tuning our platform, so please let us know if a response is ‘helpful’ or ‘not helpful’—your feedback makes us better!</p>
                    </div>
                </div>
                <CreateChatButtons />
            </div>

            <div className="py-1 hidden">
                <div className="font-bold text-white px-2">Previous Questions</div>

                {chats.length == 0 && <div className="text-white text-sm block py-1 border-b border-gray-600 my-3">
                    You haven&apos;t asked any questions yet.
                </div>}

                <div className="divide-y divide-gray-600">
                    {chats?.map((chat: SparkyConversation) => {

                        let lastMessage = chat?.messages![chat.messages!.length - 1]?.body
                        let dateHuman = parseISO(chat.createdAt).toLocaleString()
                        let model = chat?.model

                        if (lastMessage == null || lastMessage == "") {
                            lastMessage = "No messages yet"
                        }

                        return (
                            <Link href={`/chat/${chat.token}`} className="text-white flex text-sm block py-3 relative" key={chat.id}>
                                <div className="px-2">
                                    <div className="flex items-center gap-x-2 hidden">
                                        <div className="text-gray-400">{dateHuman}</div>
                                    </div>
                                    <div className={cn("line-clamp-3", {
                                        "text-gray-400": lastMessage == "No messages yet"
                                    })}>{lastMessage}</div>
                                </div>
                                <div className="ml-auto flex items-center justify-center">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
