import { SlashCommandBuilder, BaseInteraction, ClientEvents } from "discord.js";
import CommandManager from "../classes/CommandManager.ts";
import EventManager from "../classes/EventManager.ts";

export interface DiscordSlashCommand {
    /**
     * The SlashCommandBuilder instance of the command.
     */
    builder: SlashCommandBuilder;

    /**
     * The function that will be executed when the command is used.
     */
    execute: (interaction: BaseInteraction) => Promise<void>;

    /**
     * Whether this command should be hidden from the global command list.
     * Makes a command only registered to the specified test guild.
     *
     * @default false
     */
    private?: boolean;
}

export type DiscordEventType = keyof ClientEvents;

export interface DiscordEvent<
    TEventName extends DiscordEventType = DiscordEventType
> {
    name: TEventName;
    once?: boolean;
    execute: (...args: ClientEvents[TEventName]) => Promise<void>;
}

declare module "discord.js" {
    interface Client {
        commandManager: CommandManager;
        eventManager: EventManager;
    }
}
