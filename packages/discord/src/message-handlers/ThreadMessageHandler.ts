import {
    Message,
    Awaitable,
    DiscordAPIError,
    AnyThreadChannel,
} from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getPromptAndReplyMessages from "../utils/getPromptAndReplyMessages.js";
import getCleanContent from "../utils/getCleanContent.js";
import BotException from "../exceptions/BotException.js";

export default class ThreadMessageHandler extends MessageHandler {
    private static readonly STARTER_NOT_FOUND_CODE = 10008;
    private static readonly STARTER_NOT_FOUND_MESSAGE =
        "Sorry, I can't continue this conversation as I couldn't get the starter message for this thread. It may have been deleted.";
    private static readonly NOT_MENTIONED_MESSAGE =
        "I can't see the content of messages unless you use the reply function on my previous message.";
    private static readonly NO_CONTENT_MESSAGE =
        "You need to enable pinging when replying to me in order for me to see the content of your message.";

    public get name(): string {
        return ThreadMessageHandler.name;
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return (
            message.channel.isThread() &&
            message.channel.ownerId === message.client.id &&
            !message.channel.locked
        );
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        if (!message.channel.isThread()) return; // Should never happen. Only for type guard.
        const { channel } = message;

        if (
            !message.content &&
            message.mentions.repliedUser?.id !== message.client.id
        ) {
            throw new BotException(ThreadMessageHandler.NOT_MENTIONED_MESSAGE);
        }
        if (!message.content) {
            throw new BotException(ThreadMessageHandler.NO_CONTENT_MESSAGE);
        }

        try {
            const starterMessage = await channel.fetchStarterMessage({
                cache: true,
            });
            if (!starterMessage) {
                this.handleStarterMessageNotFound(channel);
                return;
            }

            const [originalPromptMessage, originalReplyMessage] =
                await getPromptAndReplyMessages(starterMessage);
            if (
                originalPromptMessage === null ||
                originalReplyMessage === null
            ) {
                return;
            }

            const threadMessagesIterator = await channel.messages.fetch({
                cache: true,
                after: starterMessage.id,
                before: message.id,
            });
            const threadMessages = Array.from(threadMessagesIterator.values());
            const messages: {
                content: string;
                role: "user" | "assistant";
            }[] = [
                {
                    content:
                        (await getCleanContent(originalPromptMessage)) ||
                        "Hello",
                    role: "user",
                },
                {
                    content: await getCleanContent(originalReplyMessage),
                    role: "assistant",
                },
                {
                    content: await getCleanContent(starterMessage),
                    role: "user",
                },
            ];

            for (const threadMessage of threadMessages.reverse()) {
                const lastMessage = messages[messages.length - 1];
                const m: (typeof messages)[number] = {
                    content: await getCleanContent(threadMessage),
                    role:
                        threadMessage.author.id === message.client.id
                            ? "assistant"
                            : "user",
                };

                if (
                    !m.content ||
                    [
                        ThreadMessageHandler.NOT_MENTIONED_MESSAGE,
                        ThreadMessageHandler.NO_CONTENT_MESSAGE,
                        MessageHandler.COOLDOWN_MESSAGE,
                    ].includes(m.content)
                ) {
                    continue;
                }

                if (lastMessage.role === m.role) {
                    continue;
                }
                messages.push(m);
            }

            const [{ content }] = await Promise.all([
                message.client.conversationManager.getChatCompletion(
                    messages,
                    message.author.id
                ),
                channel.sendTyping(),
            ]);
            await channel.send(content);
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (
                    error.code === ThreadMessageHandler.STARTER_NOT_FOUND_CODE
                ) {
                    await this.handleStarterMessageNotFound(channel);
                    return;
                }
            }
            throw error;
        }
    }

    private handleStarterMessageNotFound(channel: AnyThreadChannel) {
        return Promise.all([
            channel.send(ThreadMessageHandler.STARTER_NOT_FOUND_MESSAGE),
            channel.setLocked(true, "Starter message not found"),
            channel.setArchived(true, "Starter message not found"),
        ]);
    }
}
