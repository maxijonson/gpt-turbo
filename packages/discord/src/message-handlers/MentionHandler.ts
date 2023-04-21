import { Message, Awaitable, userMention } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import { Conversation } from "gpt-turbo";
import getCleanContent from "../utils/getCleanContent.js";
import getConversationConfig from "../utils/getConversationConfig.js";
import EmptyPromptHandler from "./EmptyPromptHandler.js";

export default class MentionHandler extends MessageHandler {
    public get name(): string {
        return MentionHandler.name;
    }

    constructor() {
        super();
        this.subHandler = new EmptyPromptHandler();
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return message.content.startsWith(userMention(message.client.id));
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const prompt = await getCleanContent(message);
        const conversation = new Conversation(getConversationConfig());
        const [{ content }] = await Promise.all([
            conversation.prompt(prompt),
            message.channel.sendTyping(),
        ]);
        await message.reply(content);
    }
}
