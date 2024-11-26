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
            return "B"
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

            <div className="px-2 py-1">
                <CreateChatButtons />
            </div>

            <div className="py-1">
                <div className="font-bold text-white px-2">Previous Chats</div>

                {chats.length == 0 && <div className="text-white text-sm block py-1 border-b border-gray-600 my-3">No chats yet</div>}

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
                                    <div className="flex items-center gap-x-2">
                                        <div className="text-gray-400">{dateHuman}</div>
                                        <div className={cn("", {
                                            "text-blue-200 bg-blue-900 rounded-md px-1": model == "Perplexity",
                                            "text-blue-300 bg-blue-900 rounded-md px-1": model == "OpenEvidence",
                                            "text-blue-100 bg-blue-900 rounded-md px-1": model == "ChatGPT",
                                            "text-blue-50 bg-blue-900 rounded-md px-1": model == "Reflection",
                                        })}>
                                            {getChatTypeName(model!)}
                                        </div>
                                    </div>
                                    <div className={cn("line-clamp-3", {
                                        "text-gray-300": lastMessage == "No messages yet"
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
