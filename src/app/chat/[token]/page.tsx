import { currentUser } from '@/api/chats';
import AuthenticatedChat from '@/components/AuthenticatedChat';
import 'stream-chat-react/dist/css/v2/index.css';

export default async function ChatDetail({ params }: { params: { token: string } }) {
    let { token } = params
    let user = await currentUser()
    console.log("User: ", user)

    return (
        <div className='h-dvh'>
            <AuthenticatedChat
                channelId={token}
                userId={user.id}
                token={user.streamToken!} />
        </div>
    )
}
