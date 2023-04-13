import { SlashCommandBuilder, BaseInteraction, Collection } from "discord.js";

export interface Command {
    builder: SlashCommandBuilder;
    execute: (interaction: BaseInteraction) => Promise<void>;
}

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;

        init(): Promise<void>;
    }
}
