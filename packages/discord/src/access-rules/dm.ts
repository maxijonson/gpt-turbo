import { Events } from "discord.js";
import createAccessRule from "../utils/createAccessRule.js";
import makeIsEvent from "../utils/makeIsEvent.js";
import { ALLOW_DMS } from "../config/env.js";
import { AccessRuleDeniedReason } from "../utils/types.js";

export default createAccessRule(
    [Events.InteractionCreate],
    async (event, ...args) => {
        const isEvent = makeIsEvent(event);

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;

            if (interaction.inGuild() && interaction.guild) {
                return {
                    isAllowed: true,
                };
            }

            if (ALLOW_DMS) {
                return {
                    isAllowed: true,
                };
            }

            return {
                isAllowed: false,
                reasons: [AccessRuleDeniedReason.DMsUnauthorized],
            };
        }

        return {
            isAllowed: true,
        };
    }
);
