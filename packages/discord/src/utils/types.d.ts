import { SlashCommandBuilder, BaseInteraction, Collection } from "discord.js";

export interface Command {
    builder: SlashCommandBuilder;
    execute: (interaction: BaseInteraction) => Promise<void>;
    private?: boolean;
}

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;

        init(): Promise<void>;
    }
}
