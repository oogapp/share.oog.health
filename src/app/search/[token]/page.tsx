import { getChatByToken } from "@/api/chats";
import { ChatBackground } from "@/components/ChatBackground";
import Ai from "@/components/icons/Ai";
import ShareMessage from "@/components/ShareMessage";


export default async function ShareSearch({ params }: { params: { token: string } }) {

    let chat = await getChatByToken(params.token);

    return (
        <div className='h-dvh relative'>


            <div className='flex gap-x-4 p-5 z-10 relative'>
                <div>
                    <Ai className='w-12 h-12' />
                </div>
                <div className="text-white">
                    <div className='text-3xl'>OOGpt</div>
                    <div className='text-3xl font-thin inline-block '>Medical Search</div>
                </div>
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
