import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { DiscordSlashCommand } from "./types.js";

export default async () => {
    const commands: DiscordSlashCommand[] = [];

    const commandsPath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "commands"
    );

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
        const commandName = file.split(".")[0];
        const command = (
            await import(
                pathToFileURL(path.join(commandsPath, file)).toString()
            )
        ).default as DiscordSlashCommand;

        if (!command) {
            throw new Error(`Command "${commandName}" could not be loaded.`);
        }
        if (!command.builder || !command.execute) {
            throw new Error(
                `Command "${commandName}" does not have a builder or execute.`
            );
        }

        commands.push(command);
    }

    return commands;
};
