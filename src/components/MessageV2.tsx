import { cn } from '@/lib/utils';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
    areMessageUIPropsEqual, MessageDeleted as DefaultMessageDeleted, MessageOptions as DefaultMessageOptions, MessageRepliesCountButton as DefaultMessageRepliesCountButton, MessageStatus as DefaultMessageStatus, MessageTimestamp as DefaultMessageTimestamp, isMessageBounced,
    isMessageEdited,
    messageHasAttachments,
    messageHasReactions,
    MessageText,
    useMessageTextStreaming
} from 'stream-chat-react';

import type { DefaultStreamChatGenerics, MessageUIComponentProps } from 'stream-chat-react';
import { Attachment as DefaultAttachment, Avatar as DefaultAvatar, EditMessageForm as DefaultEditMessageForm, ReactionsList as DefaultReactionList, MessageContextValue, useChatContext, useComponentContext, useMessageContext, useTranslationContext } from 'stream-chat-react';
import { useCurrentUser } from './CurrentUserContext';
import { MessageFooter } from './MessageFooter';
import { useVideoContext } from './VideoBackgroundContext';

type MessageSimpleWithContextProps<
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = MessageContextValue<StreamChatGenerics>;

// parse [[1]] references into clickable links
export function parseReferences(text: string) {
    return text.replace(/\[\[(\d+)\]\]/g, (match, key) => {
        return `<a data-citation-key='${key}' class='!bg-brand/20 !text-brand mr-1 p-0.5 rounded-full text-xs min-w-4 max-w-8 h-4 inline-flex items-center justify-center cursor-pointer'>
            ${match.replaceAll('[', '').replaceAll(']', '')}
        </a>`
    });
}

const MessageSimpleWithContext = <
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
    props: MessageSimpleWithContextProps<StreamChatGenerics>,
) => {
    const {
        additionalMessageInputProps,
        clearEditingState,
        editing,
        endOfGroup,
        firstOfGroup,
        groupedByUser,
        handleAction,
        handleOpenThread,
        handleRetry,
        highlighted,
        isMyMessage,
        message,
        onUserClick,
        onUserHover,
        renderText,
        threadList,
    } = props;
    const { client } = useChatContext('MessageSimple');
    const { t } = useTranslationContext('MessageSimple');
    const [isBounceDialogOpen, setIsBounceDialogOpen] = useState(false);
    const [isEditedTimestampOpen, setEditedTimestampOpen] = useState(false);

    const {
        Attachment = DefaultAttachment,
        Avatar = DefaultAvatar,
        EditMessageInput = DefaultEditMessageForm,
        MessageOptions = DefaultMessageOptions,
        // TODO: remove this "passthrough" in the next
        // major release and use the new default instead
        MessageActions = MessageOptions,
        MessageDeleted = DefaultMessageDeleted,
        MessageRepliesCountButton = DefaultMessageRepliesCountButton,
        MessageStatus = DefaultMessageStatus,
        MessageTimestamp = DefaultMessageTimestamp,
        ReactionsList = DefaultReactionList,
        //StreamedMessageText = DefaultStreamedMessageText,
    } = useComponentContext<StreamChatGenerics>('MessageSimple');

    const hasAttachment = messageHasAttachments(message);
    const hasReactions = messageHasReactions(message);

    /*if (message.customType === CUSTOM_MESSAGE_TYPE.date) {
      return null;
    }*/

    if (message.deleted_at || message.type === 'deleted') {
        return <MessageDeleted message={message} />;
    }

    const showMetadata = !groupedByUser || endOfGroup;
    const [showCitationKey, setShowCitationKey] = useState<number | null>(null);
    const showReplyCountButton = !threadList && !!message.reply_count;
    const allowRetry = message.status === 'failed' && message.errorStatusCode !== 403;
    const isBounced = isMessageBounced(message);
    const isEdited = isMessageEdited(message);
    const [isIntro, setIsIntro] = useState(false);
    const showReferences = message.is_medical_search == true
    const { streamedMessageText } = useMessageTextStreaming({
        renderingLetterCount: 10,
        streamingLetterIntervalMs: 50,
        text: message.text ?? '',
    });
    const { setIsSearching } = useVideoContext()
    const { user: currentUser } = useCurrentUser()


    const parsedMessageText = useMemo(() => {
        let t = parseReferences(streamedMessageText ?? '');

        // replace double new lines
        t = t.replace(/\n\n/g, '<br><br>');

        return t
    }, [streamedMessageText]);


    let handleClick: (() => void) | undefined = undefined;

    if (allowRetry) {
        //handleClick = () => handleRetry(message);
    } else if (isBounced) {
        //handleClick = () => setIsBounceDialogOpen(true);
    } else if (isEdited) {
        //handleClick = () => setEditedTimestampOpen((prev) => !prev);
    }

    const rootClassName = clsx(
        'str-chat__message str-chat__message-simple',
        `str-chat__message--${message.type}`,
        `str-chat__message--${message.status}`,
        isMyMessage()
            ? 'str-chat__message--me str-chat__message-simple--me '
            : 'str-chat__message--other',
        message.text ? 'str-chat__message--has-text' : 'has-no-text',
        {
            'str-chat__message--has-attachment': hasAttachment,
            //'str-chat__message--highlighted': highlighted,
            'str-chat__message--pinned pinned-message': message.pinned,
            'str-chat__message--with-reactions': hasReactions,
            'str-chat__message-send-can-be-retried':
                message?.status === 'failed' && message?.errorStatusCode !== 403,
            'str-chat__message-with-thread-link': showReplyCountButton,
            'str-chat__virtual-message__wrapper--end': endOfGroup,
            'str-chat__virtual-message__wrapper--first': firstOfGroup,
            'str-chat__virtual-message__wrapper--group': groupedByUser,
            'str-chat__is_medical_search': message.is_medical_search,
        },
    );

    const messageBodyRef = useRef<HTMLDivElement | null>(null);

    function handleCitationClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (target.tagName === 'A' && target.classList.contains('!bg-brand/20')) {
            event.preventDefault();
            let citationKey = target.getAttribute('data-citation-key');
            if (citationKey) {
                setShowCitationKey(parseInt(citationKey));
            }
        }
    }

    // listen to clicks on the message body to trigger the event
    useEffect(() => {
        if (messageBodyRef.current) {
            messageBodyRef.current.addEventListener('click', handleCitationClick);
        }

        return () => {
            if (messageBodyRef.current) {
                messageBodyRef.current.removeEventListener('click', handleCitationClick);
            }
        };
    }, [messageBodyRef.current]);

    useEffect(() => {
        if (message.is_streaming) {
            setIsSearching(true)
        } else {
            setIsSearching(false)
        }
    }, [message.is_streaming]);

    return (
        <>
            {
                <div className={rootClassName} key={message.id}>

                    <div
                        className={clsx('str-chat__message-inner', {
                            'str-chat__simple-message--error-failed': allowRetry || isBounced,
                            "!mb-6": message.is_medical_search,
                        })}
                        data-testid='message-inner'
                        onClick={handleClick}
                        onKeyUp={handleClick}
                    >

                        <div ref={messageBodyRef} className={cn('str-chat__message-bubble ', {
                            "!bg-transparent": message.is_medical_search,
                            "!bg-white/20": isMyMessage(),
                            "!bg-[#7FC311]/70": message.is_intro
                        })}>
                            {message.is_medical_search ?
                                <>
                                    {(message.text == "") &&
                                        <div className='rounded-full p-3 bg-black/20 inline-flex my-3'>
                                            <div className="bg-gradient-to-r from-white to-gray-100 inline-block text-transparent bg-clip-text">
                                                <div className='flex items-center gap-x-2 px-3'>
                                                    <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <div className='text-sm'>Searching</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div dangerouslySetInnerHTML={{ __html: parsedMessageText }} />
                                </>
                                :
                                <div>
                                    {(message.is_intro == true) &&
                                        <div className='px-4 py-2 bg-brand/20 text-white rounded-t-lg -pb-1 flex items-center gap-x-2'>
                                            <div className='text-sm text-white'>
                                                <img src="/ce-bubble.png" className="w-6 h-6" />
                                            </div>
                                            <div className='text-sm'>Earn CE</div>
                                        </div>
                                    }
                                    <MessageText message={message} renderText={renderText} />
                                </div>
                            }
                        </div>
                    </div>

                    {(showReferences && message.text != "") && (
                        <div className='str-chat__message-metadata'>
                            <MessageFooter showCitationKey={showCitationKey} />
                        </div>
                    )}
                </div>
            }
        </>
    );
};

const MemoizedMessageSimple = React.memo(
    MessageSimpleWithContext,
    areMessageUIPropsEqual,
) as typeof MessageSimpleWithContext;

/**
 * The default UI component that renders a message and receives functionality and logic from the MessageContext.
 */
export const MessageSimpleV2 = <
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
    props: MessageUIComponentProps<StreamChatGenerics>,
) => {
    const messageContext = useMessageContext<StreamChatGenerics>('MessageSimple');

    return <MemoizedMessageSimple {...messageContext} {...props} />;
};
