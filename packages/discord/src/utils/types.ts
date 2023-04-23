import {
    SlashCommandBuilder,
    BaseInteraction,
    ClientEvents,
    Awaitable,
} from "discord.js";
import CommandManager from "../managers/CommandManager.js";
import EventManager from "../managers/EventManager.js";
import MessageHandler from "../message-handlers/MessageHandler.js";
import ConversationManager from "../managers/ConversationManager.js";

export interface DiscordSlashCommand {
    builder: SlashCommandBuilder;
    execute: (interaction: BaseInteraction) => Awaitable<void>;
    ephemeral?: boolean;
}

export type DiscordEventType = keyof ClientEvents;

export interface DiscordEvent<
    TEventName extends DiscordEventType = DiscordEventType
> {
    name: TEventName;
    once?: boolean;
    execute: (...args: ClientEvents[TEventName]) => Awaitable<void>;
}

export enum AccessRuleDeniedReason {
    Error = "error",
    NotWhitelisted = "not-whitelisted",
    BlacklistedUser = "blacklisted-user",
    BlacklistedGuild = "blacklisted-guild",
    BotUnauthorized = "bot-unauthorized",
    BotsUnauthorized = "bots-unauthorized",
    DMsUnauthorized = "dms-unauthorized",
}

export interface AccessRuleDenied {
    isAllowed: false;
    reasons: AccessRuleDeniedReason[];
}

export interface AccessRuleAllowed {
    isAllowed: true;
}

export type AccessRuleResult = AccessRuleAllowed | AccessRuleDenied;

export interface AccessRule<
    TEventName extends DiscordEventType = DiscordEventType
> {
    events: TEventName[];
    isAllowed: (
        event: TEventName,
        ...args: ClientEvents[TEventName]
    ) => Awaitable<AccessRuleResult>;
}

export type ConversationUser = `discord-${string}`;

declare module "discord.js" {
    interface Client {
        id: string;
        commandManager: CommandManager;
        eventManager: EventManager;
        conversationManager: ConversationManager;

        handleMessage: (
            message: Message<boolean>
        ) => Awaitable<MessageHandler | null>;

        isOnCooldown(
            id: string,
            action: string,
            cooldownAmount?: number
        ): boolean;
    }
}
