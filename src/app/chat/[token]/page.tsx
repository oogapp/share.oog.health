import { currentUser, getEnvFromCookies } from '@/api/chats';
import AuthenticatedChat from '@/components/AuthenticatedChat';
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
        <div className='h-dvh'>
            <AuthenticatedChat
                messageVariant={MessageVariant.V1}
                apiKey={streamApiKey}
                channelId={token}
                userId={user.id}
                token={user.streamToken!} />
        </div>
    )
}
