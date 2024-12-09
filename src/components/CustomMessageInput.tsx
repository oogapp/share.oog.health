import { useMessageInputContext } from "stream-chat-react";
export const CustomMessageInput = () => {
    const { text, handleChange, handleSubmit } = useMessageInputContext();
    return (
        <div className="message-input">
            <textarea
                value={text}
                className="message-input__input"
                onChange={handleChange}
                placeholder={"Type something..."}
            />
            <button
                type="button"
                className="message-input__button"
                onClick={handleSubmit}
            >
                ⬆️
            </button>
        </div>
    );
};
