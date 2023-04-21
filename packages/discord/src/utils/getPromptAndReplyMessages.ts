import { Message, bold } from "discord.js";
import BotException from "../exceptions/BotException.js";
import getReferencedMessage from "./getReferencedMessage.js";

const ORIGINAL_NOTFOUND_MESSAGE =
    "I can't find your original prompt message. It may have been deleted.";
const MESSAGE_NOCONTENT_MESSAGE = `I can't see your message! This usually happens if you don't enable pinging when you reply. Make sure the '@' icon to the right of the message box is a blue '${bold(
    "@ ON"
)}' instead of a grey '${bold("@ OFF")}' and try again!`;
const REPLIED_TO_ERROR_MESSAGE =
    "You can't create a conversation from an error message!";
const ERROR_MESSAGES = [
    ORIGINAL_NOTFOUND_MESSAGE,
    MESSAGE_NOCONTENT_MESSAGE,
    REPLIED_TO_ERROR_MESSAGE,
];

/**
 * Gets a previous user's prompt message and its bot reply message from a user's reply to that bot's reply.
 *
 * @param userReplyMessage The user's reply to a bot's reply.
 * @returns An array containing the prompt message and the bot's reply message, previous to the user's reply. Return's `[null, null]` if the user's reply is not to a bot's reply or the reply is not found.
 * @throws {BotException} If the user's reply is to an error message.
 * @throws {BotException} If the user's reply is empty.
 */
export default async (
    userReplyMessage: Message
): Promise<[prompt: Message, reply: Message] | [null, null]> => {
    const replyMessage = await getReferencedMessage(userReplyMessage);
    const isBotReply = replyMessage?.author.id === userReplyMessage.client.id;
    if (!isBotReply) {
        return [null, null];
    }

    const repliedToError = ERROR_MESSAGES.includes(replyMessage.content);
    if (repliedToError) {
        throw new BotException(REPLIED_TO_ERROR_MESSAGE);
    }
    if (!userReplyMessage.content) {
        throw new BotException(MESSAGE_NOCONTENT_MESSAGE);
    }

    const promptMessage = await getReferencedMessage(replyMessage);
    if (!promptMessage) {
        throw new BotException(ORIGINAL_NOTFOUND_MESSAGE);
    }

    return [promptMessage, replyMessage];
};
