import { getChats } from "@/api/chats";
import CreateChatButtons from "@/components/CreateChatButtons";
import { SparkyConversation } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { parseISO } from "date-fns";
import Link from "next/link";
import { use } from "react";

export const dynamic = "force-dynamic";

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

export default function PostChat({ params }: { params: { id: string } }) {

    let chats = use(getChats())


    return (
        <div className="space-y-4">

            <div className="p-1">
                <CreateChatButtons />
            </div>

            <div className="p-1">
                <div className="font-bold text-white px-1">Previous Chats</div>

                {chats.length == 0 && <div className="text-white text-sm block py-1 border-b border-gray-600 my-3">No chats yet</div>}

                <div className="divide-y-1 divide-gray-400">
                    {chats?.map((chat: SparkyConversation) => {

                        let lastMessage = chat?.messages![chat.messages!.length - 1]?.body
                        let dateHuman = parseISO(chat.createdAt).toLocaleString()
                        let model = chat?.model

                        if (lastMessage == null || lastMessage == "") {
                            lastMessage = "No messages yet"
                        }

                        return (
                            <Link href={`/chat/${chat.token}`} className="text-white text-sm block p-1 my-3 relative" key={chat.id}>
                                <div>
                                    <div className="text-gray-400">{dateHuman}</div>
                                    <div className={cn("line-clamp-3", {
                                        "text-gray-300": lastMessage == "No messages yet"
                                    })}>{lastMessage}</div>
                                </div>
                                <div className={cn("absolute right-0 top-0 p-0.5 px-2 text-black rounded-md text-xs", {
                                    "bg-blue-700 text-white": model == "Perplexity",
                                    "bg-blue-600 text-white": model == "OpenEvidence",
                                    "bg-blue-500 text-white": model == "ChatGpt",
                                    "bg-blue-400 text-white": model == "Reflection",
                                })}>
                                    {getChatTypeName(model!)}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}