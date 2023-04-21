import { Client, Guild, GuildMember } from "discord.js";

export default async (client: Client, guildId: string | null) => {
    if (!client.user) throw new Error("Client user is not defined.");
    if (!guildId) return client.user.username;

    let guild: Guild | null = null;
    try {
        guild =
            client.guilds.cache.get(guildId) ??
            (await client.guilds.fetch(guildId));
    } finally {
        if (!guild) throw new Error(`Guild ${guildId} not found.`);
    }

    let member: GuildMember | null = null;
    try {
        member =
            guild.members.cache.get(client.id) ??
            (await guild.members.fetch(client.id));
    } finally {
        if (!member) throw new Error(`Member ${client.id} not found.`);
    }

    return member.displayName;
};
