import { Message, userMention } from "discord.js";
import getClientDisplayName from "./getClientDisplayName.js";

export default async (message: Message) => {
    if (!message.content.startsWith(userMention(message.client.id)))
        return message.cleanContent;

    const displayName = await getClientDisplayName(
        message.client,
        message.guildId
    );
    const sliceLength = `@${displayName}`.length;

    return message.cleanContent.slice(sliceLength).trim();
};
