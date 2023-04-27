import { Events, User } from "discord.js";
import createAccessRule from "../utils/createAccessRule.js";
import makeIsEvent from "../utils/makeIsEvent.js";
import { ALLOW_BOTS } from "../config/env.js";
import { AccessRuleDeniedReason } from "../utils/types.js";

export default createAccessRule(
    [Events.InteractionCreate, Events.MessageCreate],
    async (event, ...args) => {
        const isEvent = makeIsEvent(event);
        let user: User | null = null;

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;
            user = interaction.user;
        }

        if (isEvent(Events.MessageCreate, args)) {
            const [message] = args;
            user = message.author;
        }

        if (!user)
            throw new Error(`No user associated with event. (${event}))`);

        if (!user.bot) {
            return {
                isAllowed: true,
            };
        }

        if (ALLOW_BOTS) {
            if (Array.isArray(ALLOW_BOTS) && !ALLOW_BOTS.includes(user.id)) {
                return {
                    isAllowed: false,
                    reasons: [AccessRuleDeniedReason.BotUnauthorized],
                };
            }
            return {
                isAllowed: true,
            };
        }

        return {
            isAllowed: false,
            reasons: [AccessRuleDeniedReason.BotsUnauthorized],
        };
    }
);
