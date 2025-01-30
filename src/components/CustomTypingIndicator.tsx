import { useEffect } from "react";
import { TypingIndicatorProps, useChannelStateContext, useChatContext, useTypingContext } from "stream-chat-react";

export const CustomTypingIndicator = (props: TypingIndicatorProps) => {

    const { threadList } = props;
    const { channelConfig, thread } = useChannelStateContext();
    const { client } = useChatContext();
    const { typing = {} } = useTypingContext();

    useEffect(() => {
        document.querySelector(".str-chat__list")?.scrollTo({ top: 9999999, behavior: 'smooth' })
    }, [typing]);

    if (!typing.sparky_reflection_bot_v1) {
        return null;
    }

    return (
        <div className='rounded-full p-3 bg-black/20 inline-flex my-3'>
            <div className="bg-gradient-to-r from-white to-gray-100 inline-block text-transparent bg-clip-text">
                <div className='flex items-center gap-x-2 px-3'>
                    <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className='text-sm'>Thinking...</div>
                </div>
            </div>
        </div>
    )
};
