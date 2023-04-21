import { Message, Awaitable, userMention, ChannelType } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import {
    Conversation,
    MessageRoleException,
    ModerationException,
} from "gpt-turbo";
import getCleanContent from "../utils/getCleanContent.js";
import getConversationConfig from "../utils/getConversationConfig.js";
import EmptyPromptHandler from "./EmptyPromptHandler.js";
import BotException from "../exceptions/BotException.js";

export default class NewConversationHandler extends MessageHandler {
    public get name(): string {
        return NewConversationHandler.name;
    }

    constructor() {
        super();
        this.subHandler = new EmptyPromptHandler();
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        const botMention = userMention(message.client.id);
        const isPrompt =
            message.content.startsWith(botMention) ||
            message.channel.type === ChannelType.DM;
        return isPrompt;
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const prompt = await getCleanContent(message);
        try {
            const conversation = new Conversation(getConversationConfig());
            const [{ content }] = await Promise.all([
                conversation.prompt(prompt),
                message.channel.sendTyping(),
            ]);
            await message.reply(content);
        } catch (error) {
            if (error instanceof ModerationException) {
                const flags = error.flags.join(", ");
                throw new BotException(
                    `Your message (or the response) was flagged for ${flags}.`
                );
            } else if (error instanceof MessageRoleException) {
                // Since this is a new conversation, this should never happen
                throw new BotException(
                    "There was an issue with the order of the messages. This can happen when two replies in a row are sent by a user/assistant."
                );
            } else {
                console.error(error);
                throw new BotException(
                    "There was an error while generating a response."
                );
            }
        }
    }
}
