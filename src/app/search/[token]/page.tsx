import { getChatByToken } from "@/api/chats";
import { ChatBackground } from "@/components/ChatBackground";
import ShareMessage from "@/components/ShareMessage";


export default async function ShareSearch({ params }: { params: { token: string } }) {

    let chat = await getChatByToken(params.token);

    return (
        <div className='h-dvh relative'>

            <div className="space-y-1 p-5 relative z-10 relative">
                <div className='text-3xl'>OOG</div>
                <div className='text-3xl bg-gradient-to-r from-white to-gray-100 font-thin inline-block text-transparent bg-clip-text'>Medical Search</div>
            </div>

            <div className="flex flex-col z-10 relative">
                {chat?.messages?.sort((a, b) => {
                    return parseInt(a.id) - parseInt(b.id)
                })?.map((message) => {

                    return (
                        <div key={message.id}>
                            <ShareMessage message={message} />
                        </div>
                    )
                })}
            </div>

            <div className='absolute -top-14 inset-0 z-0'>
                <ChatBackground />
            </div>
        </div>
    )
}
