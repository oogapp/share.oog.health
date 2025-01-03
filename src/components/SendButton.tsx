import React from 'react';
import { Message } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react';
import Send from './icons/Send';

export type SendButtonProps<
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = {
    sendMessage: (
        event: React.BaseSyntheticEvent,
        customMessageData?: Partial<Message<StreamChatGenerics>>,
    ) => void;
} & React.ComponentProps<'button'>;
export const SendButton = <
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>({
    sendMessage,
    ...rest
}: SendButtonProps<StreamChatGenerics>) => (
    <button
        aria-label='Send'
        data-testid='send-button'
        onClick={sendMessage}
        type='button'
        {...rest}
    >
        <Send />
    </button>
);
