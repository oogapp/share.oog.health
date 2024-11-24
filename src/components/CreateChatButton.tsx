'use client'
import { createChat } from "@/api/chats";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function CreateChat({ postId }: { postId: string }) {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleCreateChat() {
        setLoading(true);
        let token = await createChat(postId);
        setLoading(false);
        router.push(`/posts/${postId}/chat/${token}`);
    }

    return (
        <div>
            <div className="p-1">
                <Button disabled={loading} onClick={handleCreateChat}>
                    Start Reflective Chat
                </Button>
            </div>
        </div>
    )
}
