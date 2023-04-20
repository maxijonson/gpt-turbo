import { Message, Awaitable } from "discord.js";
import MessageHandler from "./MessageHandler.js";

export default class IncomingMessageHandler extends MessageHandler {
    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return !message.content || message.author.id === message.client.user.id;
    }

    protected handle(_message: Message<boolean>): Awaitable<void> {
        /** Do nothing. Stops the chain from going any further. */
    }
}
