import { Message } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import { EMPTY_PROMPT_REPLIES } from "../config/constants.js";
import getCleanContent from "../utils/getCleanContent.js";

export default class EmptyPromptHandler extends MessageHandler {
    protected async canHandle(message: Message<boolean>): Promise<boolean> {
        const prompt = await getCleanContent(message);
        return !prompt;
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const reply =
            EMPTY_PROMPT_REPLIES[
                Math.floor(Math.random() * EMPTY_PROMPT_REPLIES.length)
            ];
        await message.reply(reply);
    }
}
