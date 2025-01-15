import { trackAnalytics } from "@/lib/analytics";
import { MessageInput, MessageToSend, useChannelActionContext, useMessageInputContext } from "stream-chat-react";
import { useCurrentUser } from "./CurrentUserContext";
import { useKeyboardOpenContext } from "./KeyboardOpenProvider";
import { useReflectionContext } from "./ReflectionProvider";


export const CustomMessageInput = () => {
    const { text, handleChange, handleSubmit } = useMessageInputContext();
    const { setOpen } = useKeyboardOpenContext()
    const { sendMessage } = useChannelActionContext();
    const { user: currentUser } = useCurrentUser()
    const { isReflection } = useReflectionContext()

    let eventName = isReflection ? "Reflection - Submitted" : "Medical Search - Messaging - Search - Submitted"

    return (
        <MessageInput
            overrideSubmitHandler={(message: MessageToSend, cid: string) => {
                trackAnalytics(eventName, {
                    userId: currentUser.id,
                    query: message.text,
                })
                sendMessage(message)
            }}
            additionalTextareaProps={{
                placeholder: 'Ask me anything',
                onFocus: () => {
                    setOpen(true)
                    setTimeout(() => {
                        document.querySelector(".str-chat__list")?.scrollTo({ top: 9999999, behavior: 'smooth' })
                    }, 500)
                },
                onBlur: () => {
                    setOpen(false)
                },
            }}
            grow />
    );
};
