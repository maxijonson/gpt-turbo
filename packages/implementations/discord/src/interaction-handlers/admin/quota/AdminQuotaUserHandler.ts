import {
    Interaction,
    Awaitable,
    Colors,
    italic,
    ButtonBuilder,
    ButtonStyle,
    InteractionResponse,
    Message,
} from "discord.js";
import getHandlerId from "../../../utils/getHandlerId.js";
import reply from "../../../utils/reply.js";
import AdminQuotaSnowflakeHandler from "./AdminQuotaSnowflakeHandler.js";

export default class AdminQuotaUserHandler extends AdminQuotaSnowflakeHandler {
    public static readonly ID = getHandlerId(AdminQuotaUserHandler.name);

    constructor() {
        super(AdminQuotaUserHandler.ID);
    }

    public get name(): string {
        return AdminQuotaUserHandler.name;
    }

    protected getCurrentQuota(
        interaction: Interaction,
        userId: string
    ): Awaitable<number> {
        const { quotaManager } = interaction.client;
        return quotaManager.getQuota(userId);
    }

    protected async getInitialReply(
        interaction: Interaction,
        userId: string
    ): Promise<Message<boolean> | InteractionResponse<boolean> | null> {
        const { quotaManager } = interaction.client;

        const quota = await this.getCurrentQuota(interaction, userId);
        const hasQuota = await quotaManager.hasUserQuota(userId);
        const [quotaRole] = await quotaManager.getUserQuotaRole(userId);

        const quotaFormat = Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 0,
        }).format(quota);
        const quotaType = (() => {
            if (hasQuota) {
                return "";
            }
            return `(${italic(quotaRole?.name ?? "default")})`;
        })();

        const usage = await quotaManager.getUsage(userId);
        const usagePercent = new Intl.NumberFormat("en-US", {
            style: "percent",
            maximumFractionDigits: 0,
        }).format(usage / quota);

        const row = this.createMessageActionRow().addComponents(
            new ButtonBuilder()
                .setCustomId(AdminQuotaSnowflakeHandler.BUTTON_SET_ID)
                .setLabel("Set Quota")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔧")
        );

        if (hasQuota) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(AdminQuotaSnowflakeHandler.BUTTON_RESET_ID)
                    .setLabel("Reset Quota")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🔄")
            );
        }

        return reply(interaction, {
            ephemeral: true,
            embeds: [
                {
                    title: "User Quota Information",
                    fields: [
                        {
                            name: "Current Quota",
                            value: `${quotaFormat} ${quotaType}`,
                            inline: true,
                        },
                        {
                            name: "Current usage",
                            value: `${usage} (${usagePercent})`,
                            inline: true,
                        },
                    ],
                    color: Colors.Blue,
                },
            ],
            components: [row],
        });
    }

    protected async deleteQuota(
        interaction: Interaction,
        userId: string
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        await quotaManager.deleteUserQuota(userId);
    }

    protected getModalTitle(): string {
        return "Set User Quota";
    }

    protected async setQuota(
        interaction: Interaction,
        userId: string,
        quota: number
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        await quotaManager.setUserQuota(userId, quota);
    }
}
