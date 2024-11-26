import { getChats } from "@/api/chats";
import { getPost } from "@/api/post";
import CreateChatButton from "@/components/CreateChatButton";
import { parseISO } from "date-fns";
import Link from "next/link";
import { use } from "react";

export const dynamic = "force-dynamic";
function getChatTypeName(mode: String) {
    switch (mode) {
        case "A":
            return "Perplexity"
        case "B":
            return "OpenEvidence"
        case "C":
            return "ChatGpt"
    }
}

export default function PostChat({ params }: { params: { id: string } }) {

    let chats = use(getChats(params.id))
    let post = use(getPost(params.id))


    return (
        <div>

            <div className="p-1">
                <div className="text-white text-2xl font-bold">{post.title}</div>
            </div>

            <div className="p-1">
                <CreateChatButton postId={params.id} />
            </div>

            <div className="p-1">
                <div className="font-bold text-white">Previous Chats</div>

                {chats.length == 0 && <div className="text-white text-sm block py-1 border-b border-gray-600 my-3">No chats yet</div>}

                {chats?.map((chat) => {

                    let lastMessage = chat?.messages![chat.messages!.length - 1]?.body
                    let dateHuman = parseISO(chat.createdAt).toLocaleString()

                    return (
                        <Link href={`/posts/${params.id}/chat/${chat.token}`} className="text-white text-sm block py-1 border-b border-gray-600 my-3" key={chat.id}>
                            <div>
                                <div>{lastMessage}</div>
                                <div className="text-gray-500">{dateHuman}</div>
                            </div>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}
