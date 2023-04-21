import { Message, Awaitable } from "discord.js";
import MessageHandler from "./MessageHandler.js";

export default class IncomingMessageHandler extends MessageHandler {
    public get name(): string {
        return IncomingMessageHandler.name;
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return message.author.id === message.client.id;
    }

    protected handle(_message: Message<boolean>): Awaitable<void> {
        /** Do nothing. Stops the chain from going any further. */
    }
}
