import { Message } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getCleanContent from "../utils/getCleanContent.js";

export default class EmptyPromptHandler extends MessageHandler {
    public get name(): string {
        return EmptyPromptHandler.name;
    }

    static readonly EMPTY_PROMPT_REPLIES = [
        "Hi! How can I assist you",
        "Hi! How can I help you?",
        "Hi! What can I do for you?",
        "Hey! How can I assist you",
        "Hey! How can I help you?",
        "Hey! What can I do for you?",
        "Hello! How can I assist you",
        "Hello! How can I help you?",
        "Hello! What can I do for you?",
    ];

    protected async canHandle(message: Message<boolean>): Promise<boolean> {
        const prompt = await getCleanContent(message);
        return !prompt;
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const reply =
            EmptyPromptHandler.EMPTY_PROMPT_REPLIES[
                Math.floor(
                    Math.random() *
                        EmptyPromptHandler.EMPTY_PROMPT_REPLIES.length
                )
            ];
        await message.reply(reply);
    }
}
