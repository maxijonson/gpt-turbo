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
    const data: any = await rest.put(
        Routes.applicationCommands(DISCORD_CLIENT_ID),
        { body: commands.map((command) => command.builder.toJSON()) }
    );

    console.info(
        `${
            data?.length ?? "[UNKNOWN]"
        } Public slash commands registered successfully.`
    );
} catch (error) {
    console.error(error);
}
