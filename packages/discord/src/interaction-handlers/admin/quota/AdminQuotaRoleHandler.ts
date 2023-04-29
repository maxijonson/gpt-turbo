import {
    Interaction,
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

export default class AdminQuotaRoleHandler extends AdminQuotaSnowflakeHandler {
    public static readonly ID = getHandlerId(AdminQuotaRoleHandler.name);

    constructor() {
        super(AdminQuotaRoleHandler.ID);
    }

    public get name(): string {
        return AdminQuotaRoleHandler.name;
    }

    protected async getCurrentQuota(
        interaction: Interaction,
        roleId: string
    ): Promise<number> {
        const { quotaManager } = interaction.client;
        return (
            (await quotaManager.getRoleQuota(roleId)) ??
            (await quotaManager.getDefaultQuota())
        );
    }

    protected async getInitialReply(
        interaction: Interaction,
        roleId: string
    ): Promise<Message<boolean> | InteractionResponse<boolean> | null> {
        const { quotaManager } = interaction.client;

        const quota = await this.getCurrentQuota(interaction, roleId);
        const hasQuota = await quotaManager.hasRoleQuota(roleId);

        const quotaFormat = Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 0,
        }).format(quota);
        const quotaType = (() => {
            if (hasQuota) {
                return "";
            }
            return `(${italic("default")})`;
        })();

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
                    title: "Role Quota Information",
                    fields: [
                        {
                            name: "Current Quota",
                            value: `${quotaFormat} ${quotaType}`,
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
        roleId: string
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        await quotaManager.deleteRoleQuota(roleId);
    }

    protected getModalTitle(): string {
        return "Set Role Quota";
    }

    protected async setQuota(
        interaction: Interaction,
        roleId: string,
        quota: number
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        await quotaManager.setRoleQuota(roleId, quota);
    }
}
