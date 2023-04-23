import { Colors, SlashCommandBuilder } from "discord.js";
import { DiscordSlashCommand } from "../utils/types.js";

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

        const [quota, usage] = await Promise.all([
            quotaManager.getQuota(interaction.user.id),
            quotaManager.getUsage(interaction.user.id),
        ]);
        const left = quota - usage;
        const percent = usage / quota;

        const quotaTokens = tokenFormat.format(quota);
        const usageTokens = tokenFormat.format(Math.min(usage, quota));
        const leftTokens = tokenFormat.format(left);
        const percentString = percentFormat.format(Math.min(percent, 1));

        const isExceeded = usage >= quota;
        const color = (() => {
            if (isExceeded) return Colors.Red;
            if (usage >= quota * 0.8) return Colors.Orange;
            if (usage >= quota * 0.5) return Colors.Yellow;
            return Colors.Green;
        })();

        await interaction.followUp({
            embeds: [
                {
                    title: `Usage (${percentString})`,
                    description:
                        left <= 0
                            ? `You have used ${usageTokens} tokens out of your ${quotaTokens} quota`
                            : `You have used ${usageTokens} tokens out of your ${quotaTokens} quota (${leftTokens} left)`,
                    color,
                },
            ],
        });
    },
    ephemeral: true,
};

export default usageCommand;
