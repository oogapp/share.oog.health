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

    return (
        <MessageInput
            overrideSubmitHandler={(message: MessageToSend, cid: string) => {
                if (isReflection) {
                    trackAnalytics("Reflection - Submitted", {
                        userId: currentUser.id,
                        reflectionTargetType: "medicalSearch"
                    })
                } else {
                    trackAnalytics("Medical Search - Messaging - Search - Submitted", {
                        userId: currentUser.id,
                    })
                }
                sendMessage(message)
            }}
            additionalTextareaProps={{
                placeholder: isReflection ? "Type your reflection here..." : "Ask me anything",
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
