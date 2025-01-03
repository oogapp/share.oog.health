'use client'
import { getChats } from "@/api/chats";
import { SparkyConversation } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PreviousSearches() {

    const [chats, setChats] = useState<SparkyConversation[]>([])
    useEffect(() => {
        getChats().then((chats) => {
            setChats(chats)
        })
    }, [])


    return (
        <div className="space-y-4 h-[400px] overflow-y-scroll">

            <div className="py-1">

                {chats.length == 0 && <div className="text-white text-sm block py-1 border-b border-gray-600 my-3">
                    You haven&apos;t asked any questions yet.
                </div>}

                <div className="divide-y divide-gray-600">
                    {chats?.map((chat: SparkyConversation) => {

                        let messages = chat.messages!.sort((a, b) => parseInt(a.id) - parseInt(b.id))

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
                            <Link href={`/chat/v2/${chat.token}`} className="text-white text-sm flex  block py-3 relative" key={chat.id}>
                                <div className="px-2 space-y-2">
                                    <div className="flex items-center gap-x-2 hidden">
                                        <div className="text-gray-400">{dateHuman}</div>
                                    </div>
                                    <div className={cn("line-clamp-3 text-sm", {
                                        "text-gray-400": firstMessage == "No messages yet"
                                    })}>{firstMessage}</div>
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
