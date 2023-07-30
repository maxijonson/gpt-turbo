import { Message } from "../../classes/Message.js";

/**
 * Listener for when a {@link Message} is added to a conversation.
 */
export type AddMessageListener = (
    /**
     * The {@link Message message} that was added
     */
    message: Message
) => void;

/**
 * Listener for when a {@link Message} is removed from a conversation.
 */
export type RemoveMessageListener = (
    /**
     * The {@link Message message} that was removed
     */
    message: Message
) => void;
