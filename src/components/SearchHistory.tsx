import { getChats } from "@/api/chats";
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

export default function SearchHistory() {

    let chats = use(getChats())


    return (
        <div className="space-y-4">

            <div className="py-1">

                {chats.length == 0 && <div className="text-white text-sm block py-1 border-b border-gray-600 my-3">
                    You haven&apos;t asked any questions yet.
                </div>}

                <div className="divide-y divide-gray-600">
                    {chats?.map((chat: SparkyConversation) => {

                        let messages = chat.messages!.sort((a, b) => parseInt(a.id) - parseInt(b.id))
                        if (chat.token == "2qERG53lVxD30y7gJQV2RAs6xjF") {
                            console.log(messages)
                        }

                        let firstMessage = messages![0]?.body
                        let secondMessage = null
                        if (messages!.length > 1) {
                            secondMessage = messages![1]?.body
                        }
                        let dateHuman = parseISO(chat.createdAt).toLocaleString()
                        let model = chat?.model

                        if (firstMessage == null || firstMessage == "") {
                            firstMessage = "No messages yet"
                        }

                        return (
                            <Link href={`/chat/${chat.token}`} className="text-white  flex text-sm block py-3 relative" key={chat.id}>
                                <div className="px-2 space-y-2">
                                    <div className="flex items-center gap-x-2 hidden">
                                        <div className="text-gray-400">{dateHuman}</div>
                                    </div>
                                    <div className={cn("line-clamp-3 font-bold", {
                                        "text-gray-400": firstMessage == "No messages yet"
                                    })}>{firstMessage}</div>
                                    {secondMessage && <div className="line-clamp-3 text-gray-300">{secondMessage}</div>}
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
