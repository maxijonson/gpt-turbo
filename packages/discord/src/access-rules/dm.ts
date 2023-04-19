import { Events } from "discord.js";
import createAccessRule from "../utils/createAccessRule.js";
import makeIsEvent from "../utils/makeIsEvent.js";
import { ALLOW_DMS } from "../config/env.js";
import { AccessRuleDeniedReason } from "../utils/types.js";

export default createAccessRule(
    [Events.InteractionCreate, Events.MessageCreate],
    async (event, ...args) => {
        const isEvent = makeIsEvent(event);
        let isDM: boolean | null = null;

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;
            isDM = interaction.guild === null;
        }

        if (isEvent(Events.MessageCreate, args)) {
            const [message] = args;
            isDM = message.guild === null;
        }

        if (!isDM || ALLOW_DMS) {
            return {
                isAllowed: true,
            };
        }

        return {
            isAllowed: false,
            reasons: [AccessRuleDeniedReason.DMsUnauthorized],
        };
    }
);
