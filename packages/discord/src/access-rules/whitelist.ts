import { Events } from "discord.js";
import createAccessRule from "../utils/createAccessRule.js";
import makeIsEvent from "../utils/makeIsEvent.js";
import { WHITELIST_GUILDS, WHITELIST_USERS } from "../config/env.js";
import { AccessRuleDeniedReason } from "../utils/types.js";

export default createAccessRule(
    [Events.InteractionCreate],
    async (event, ...args) => {
        if (!WHITELIST_USERS.length && !WHITELIST_GUILDS.length) {
            return {
                isAllowed: true,
            };
        }

        const isEvent = makeIsEvent(event);

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;
            const { user, guild } = interaction;

            if (WHITELIST_USERS.includes(user.id)) {
                return {
                    isAllowed: true,
                };
            }

            if (guild && WHITELIST_GUILDS.includes(guild.id)) {
                return {
                    isAllowed: true,
                };
            }

            return {
                isAllowed: false,
                reasons: [AccessRuleDeniedReason.NotWhitelisted],
            };
        }

        return {
            isAllowed: true,
        };
    }
);
