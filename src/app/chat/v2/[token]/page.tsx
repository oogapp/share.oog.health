import { currentUser, getEnvFromCookies } from '@/api/chats';
import AuthenticatedChat from '@/components/AuthenticatedChat';
import { ChatBackgroundVideo } from '@/components/ChatBackgroundVideo';
import { VideoContextProvider } from '@/components/VideoBackgroundContext';
import { MessageVariant } from '@/lib/utils';
import 'stream-chat-react/dist/css/v2/index.css';



export default async function ChatDetail({ params }: { params: { token: string } }) {
    let { token } = params
    let user = await currentUser()
    let env = getEnvFromCookies()
    let streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
    if (env == "staging") {
        streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY_STAGING!
    }

    return (
        <>
            <VideoContextProvider>

                <div className='absolute -top-14 inset-0'>
                    <ChatBackgroundVideo />
                </div>


                <AuthenticatedChat
                    messageVariant={MessageVariant.V2}
                    apiKey={streamApiKey}
                    channelId={token}
                    userId={user.id}
                    token={user.streamToken!} />
            </VideoContextProvider>
        </>
    )
}
