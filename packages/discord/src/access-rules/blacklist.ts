import { Events } from "discord.js";
import createAccessRule from "../utils/createAccessRule.js";
import makeIsEvent from "../utils/makeIsEvent.js";
import { BLACKLIST_GUILDS, BLACKLIST_USERS } from "../config/env.js";
import { AccessRuleDeniedReason } from "../utils/types.js";

export default createAccessRule(
    [Events.InteractionCreate],
    async (event, ...args) => {
        if (!BLACKLIST_USERS.length && !BLACKLIST_GUILDS.length) {
            return {
                isAllowed: true,
            };
        }

        const isEvent = makeIsEvent(event);

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;
            const { user, guild } = interaction;

            if (BLACKLIST_USERS.includes(user.id)) {
                return {
                    isAllowed: false,
                    reasons: [AccessRuleDeniedReason.BlacklistedUser],
                };
            }

            if (guild && BLACKLIST_GUILDS.includes(guild.id)) {
                return {
                    isAllowed: false,
                    reasons: [AccessRuleDeniedReason.BlacklistedGuild],
                };
            }

            return {
                isAllowed: true,
            };
        }

        return {
            isAllowed: true,
        };
    }
);
