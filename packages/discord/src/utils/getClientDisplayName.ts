import { Client } from "discord.js";

export default (client: Client, guildId: string | null) => {
    if (!client.user) throw new Error("Client user is not defined.");
    if (!guildId) return client.user.username;

    const guild = client.guilds.cache.get(guildId);

    if (!guild) throw new Error(`Guild ${guildId} not found.`);

    const member = guild.members.cache.get(client.user.id);

    if (!member) throw new Error(`Member ${client.user.id} not found.`);

    return member.displayName;
};
