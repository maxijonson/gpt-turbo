import { Events, Guild, User } from "discord.js";
import createAccessRule from "../utils/createAccessRule.js";
import makeIsEvent from "../utils/makeIsEvent.js";
import { WHITELIST_GUILDS, WHITELIST_USERS } from "../config/env.js";
import { AccessRuleDeniedReason } from "../utils/types.js";

export default createAccessRule(
    [Events.InteractionCreate, Events.MessageCreate],
    async (event, ...args) => {
        if (!WHITELIST_USERS.length && !WHITELIST_GUILDS.length) {
            return {
                isAllowed: true,
            };
        }

        const isEvent = makeIsEvent(event);
        let user: User | null = null;
        let guild: Guild | null = null;

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;
            user = interaction.user;
            guild = interaction.guild;
        }

        if (isEvent(Events.MessageCreate, args)) {
            const [message] = args;
            user = message.author;
            guild = message.guild;
        }

        if (!user)
            throw new Error(`No user associated with event. (${event}))`);

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
);
