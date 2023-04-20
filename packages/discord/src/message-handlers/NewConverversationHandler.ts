import {
    Message,
    Awaitable,
    userMention,
    ChannelType,
    italic,
} from "discord.js";
import MessageHandler from "./MessageHandler.js";
import {
    Conversation,
    MessageRoleException,
    ModerationException,
} from "gpt-turbo";
import getCleanContent from "../utils/getCleanContent.js";
import getConversationConfig from "../utils/getConversationConfig.js";
import EmptyPromptHandler from "./EmptyPromptHandler.js";

export default class NewConversationHandler extends MessageHandler {
    constructor() {
        super();
        this.subHandler = new EmptyPromptHandler();
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        const botMention = userMention(message.client.user.id);
        const isPrompt =
            message.content.startsWith(botMention) ||
            message.channel.type === ChannelType.DM;
        return isPrompt;
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const prompt = await getCleanContent(message);
        const messageReplyPromise = message.reply(italic("Thinking..."));
        try {
            const conversation = new Conversation(getConversationConfig());
            const [messageReply, { content }] = await Promise.all([
                messageReplyPromise,
                conversation.prompt(prompt),
            ]);
            await messageReply.edit(content);
        } catch (error) {
            const messageReply = await messageReplyPromise;
            if (error instanceof ModerationException) {
                const flags = error.flags.join(", ");
                await messageReply.edit(
                    `Your message (or the response) was flagged for ${flags}.`
                );
            } else if (error instanceof MessageRoleException) {
                // Since this is a new conversation, this should never happen
                await messageReply.edit(
                    "There was an issue with the order of the messages. This can happen when two replies in a row are sent by a user/assistant."
                );
            } else {
                console.error(error);
                await messageReply.edit(
                    "There was an error while generating a response."
                );
            }
        }
    }
}
