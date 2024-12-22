import { getChatByToken } from "@/api/chats";
import { cn } from "@/lib/utils";

export default async function ShareSearch({ params }: { params: { token: string } }) {

    let chat = await getChatByToken(params.token);
    console.log(chat)

    return (
        <div className="flex flex-col">
            {chat?.messages?.sort((a, b) => {
                return parseInt(a.id) - parseInt(b.id)
            })?.map((message) => {
                return (
                    <div key={message.id} className={cn("flex p-4 m-4 ", {
                        "justify-end": !message?.sentBySparky
                    })}>
                        <div className="">{message.body}</div>
                    </div>
                )
            })}
        </div>
    )
}
