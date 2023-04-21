import path from "path";
import { fileURLToPath } from "url";
import { REST, Routes } from "discord.js";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "../config/env.js";
import loadResource from "../utils/loadResource.js";
import { DiscordSlashCommand } from "../utils/types.js";

const commands = await loadResource<DiscordSlashCommand>(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "commands"),
    ["builder", "execute"]
);
const rest = new REST().setToken(DISCORD_TOKEN);

try {
    const commandsJson = commands.map((command) => command.builder.toJSON());

    const current = (await rest.get(
        Routes.applicationCommands(DISCORD_CLIENT_ID)
    )) as object[];

    const hasChanged = commandsJson.some((c) => {
        const command = current.find(
            (cc) => (cc as any).name === c.name
        ) as any;
        if (!command) return true;
        return command.description !== c.description;
    });

    if (!hasChanged) {
        console.info("No changes detected, exiting.");
        process.exit();
    }

    const data = (await rest.put(
        Routes.applicationCommands(DISCORD_CLIENT_ID),
        { body: commandsJson }
    )) as object[];

    console.info(
        `${
            data?.length ?? "[UNKNOWN]"
        } Public slash commands registered successfully.`
    );
} catch (error) {
    console.error(error);
}
