import { Message, Awaitable, userMention } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getCleanContent from "../utils/getCleanContent.js";
import EmptyPromptHandler from "./EmptyPromptHandler.js";

export default class NewConversationHandler extends MessageHandler {
    public get name(): string {
        return NewConversationHandler.name;
    }

    constructor() {
        super();
        this.subHandler = new EmptyPromptHandler();
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return (
            message.content.startsWith(userMention(message.client.id)) ||
            (message.channel.isDMBased() &&
                message.channel.isTextBased() &&
                !message.reference)
        );
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const prompt = await getCleanContent(message);
        const [{ content }] = await Promise.all([
            message.client.conversationManager.getChatCompletion([prompt]),
            message.channel.sendTyping(),
        ]);
        await message.reply(content);
    }
}
