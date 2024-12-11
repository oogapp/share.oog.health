import { cn } from '@/lib/utils';
import clsx from 'clsx';
import React, { useState } from 'react';

import {
    areMessageUIPropsEqual, MessageDeleted as DefaultMessageDeleted, MessageOptions as DefaultMessageOptions, MessageRepliesCountButton as DefaultMessageRepliesCountButton, MessageStatus as DefaultMessageStatus, MessageTimestamp as DefaultMessageTimestamp, isMessageBounced,
    isMessageEdited,
    messageHasAttachments,
    messageHasReactions, MessageText
} from 'stream-chat-react';

import type { DefaultStreamChatGenerics, MessageUIComponentProps } from 'stream-chat-react';
import { Attachment as DefaultAttachment, Avatar as DefaultAvatar, EditMessageForm as DefaultEditMessageForm, ReactionsList as DefaultReactionList, MessageContextValue, MessageErrorIcon, MML, useChatContext, useComponentContext, useMessageContext, useTranslationContext } from 'stream-chat-react';
import { CustomMessageStatus } from './CustomMessageStatus';

type MessageSimpleWithContextProps<
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = MessageContextValue<StreamChatGenerics>;

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
    const showReplyCountButton = !threadList && !!message.reply_count;
    const allowRetry = message.status === 'failed' && message.errorStatusCode !== 403;
    const isBounced = isMessageBounced(message);
    const isEdited = isMessageEdited(message);
    const showReferences = message.is_medical_search == true


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

    return (
        <>
            {
                <div className={rootClassName} key={message.id}>
                    {message.user && (
                        <Avatar
                            image={message.user.image}
                            name={message.user.name || message.user.id}
                            onClick={onUserClick}
                            onMouseOver={onUserHover}
                            user={message.user}
                        />
                    )}
                    <div
                        className={clsx('str-chat__message-inner', {
                            'str-chat__simple-message--error-failed': allowRetry || isBounced,
                            "!m-0": message.is_medical_search,
                        })}
                        data-testid='message-inner'
                        onClick={handleClick}
                        onKeyUp={handleClick}
                    >

                        <div className={cn('str-chat__message-bubble', {
                            "!bg-transparent": message.is_medical_search,
                            'bg-stream-message-from-me': isMyMessage()
                        })}>
                            {message.attachments?.length && !message.quoted_message ? (
                                <Attachment actionHandler={handleAction} attachments={message.attachments} />
                            ) : null}
                            <MessageText message={message} renderText={renderText} />
                            {message.mml && (
                                <MML
                                    actionHandler={handleAction}
                                    align={isMyMessage() ? 'right' : 'left'}
                                    source={message.mml}
                                />
                            )}
                            <MessageErrorIcon />
                        </div>
                    </div>

                    {showReferences && (
                        <div className='str-chat__message-metadata min-h-96'>
                            <CustomMessageStatus />
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
export const MessageSimple = <
    StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
    props: MessageUIComponentProps<StreamChatGenerics>,
) => {
    const messageContext = useMessageContext<StreamChatGenerics>('MessageSimple');

    return <MemoizedMessageSimple {...messageContext} {...props} />;
};
