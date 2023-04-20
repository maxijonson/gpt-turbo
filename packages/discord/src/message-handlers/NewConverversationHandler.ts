import {
    Message,
    Awaitable,
    userMention,
    ChannelType,
    italic,
} from "discord.js";
import MessageHandler from "./MessageHandler.js";
import { Conversation } from "gpt-turbo";
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
        const promptMessagePromise = message.reply(italic("Thinking..."));
        try {
            const conversation = new Conversation(getConversationConfig());
            const [promptMessage, { content }] = await Promise.all([
                promptMessagePromise,
                conversation.prompt(prompt),
            ]);
            await promptMessage.edit(content);
        } catch (error) {
            console.error(error);
            (await promptMessagePromise).edit(
                "There was an error while generating a response."
            );
        }
    }
}
