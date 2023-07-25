import { Colors, SlashCommandBuilder } from "discord.js";
import { DiscordSlashCommand } from "../utils/types.js";
import reply from "../utils/reply.js";

const tokenFormat = Intl.NumberFormat("en-US");
const percentFormat = Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0,
});

const usageCommand: DiscordSlashCommand = {
    builder: new SlashCommandBuilder()
        .setName("usage")
        .setDescription("Get your current usage information and quota"),
    execute: async (interaction) => {
        if (!interaction.isRepliable()) return;
        const { quotaManager } = interaction.client;

        const [quota, usage, [quotaRole]] = await Promise.all([
            quotaManager.getQuota(interaction.user.id),
            quotaManager.getUsage(interaction.user.id),
            quotaManager.getUserQuotaRole(interaction.user.id),
        ]);
        const remaining = quota - usage;
        const percent = usage / quota;

        const quotaTokens = tokenFormat.format(quota);
        const usageTokens = tokenFormat.format(Math.min(usage, quota));
        const remainingTokens = tokenFormat.format(remaining);
        const percentString = percentFormat.format(Math.min(percent, 1));

        const isExceeded = usage >= quota;
        const color = (() => {
            if (isExceeded) return Colors.Red;
            if (usage >= quota * 0.8) return Colors.Orange;
            if (usage >= quota * 0.5) return Colors.Yellow;
            return Colors.Green;
        })();

        await reply(interaction, {
            embeds: [
                {
                    title: `Usage (${percentString})`,
                    fields: [
                        {
                            name: "Usage",
                            value: `${usageTokens}`,
                            inline: true,
                        },
                        {
                            name: "Quota",
                            value: `${quotaTokens}`,
                            inline: true,
                        },
                        {
                            name: "Remaining",
                            value: `${remainingTokens}`,
                            inline: true,
                        },
                    ],
                    footer:
                        quotaRole !== null
                            ? {
                                  text: `❗ Quota given for having the "${quotaRole.name}" role`,
                              }
                            : undefined,
                    color,
                },
            ],
        });
    },
    ephemeral: true,
};

export default usageCommand;
