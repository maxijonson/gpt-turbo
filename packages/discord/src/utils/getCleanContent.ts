import { Message, userMention } from "discord.js";
import getClientDisplayName from "./getClientDisplayName.js";

export default async (message: Message) => {
    const botMention = userMention(message.client.user.id);
    const displayName = await getClientDisplayName(
        message.client,
        message.guildId
    );

    return message.content.startsWith(botMention)
        ? message.cleanContent.replace(`@${displayName}`, "").trim()
        : message.cleanContent;
};
