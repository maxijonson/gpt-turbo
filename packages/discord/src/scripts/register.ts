import path from "path";
import { fileURLToPath } from "url";
import { REST, Routes } from "discord.js";
import {
    DISCORD_CLIENT_ID,
    DISCORD_TOKEN,
    DISCORD_TEST_SERVER_ID,
} from "../config/env.js";
import loadResource from "../utils/loadResource.js";
import { DiscordSlashCommand } from "../utils/types.js";

const commands = await loadResource<DiscordSlashCommand>(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "commands"),
    ["builder", "execute"]
);
const privateCommands = commands.filter((command) => command.private);
const publicCommands = commands.filter((command) => !command.private);
const rest = new REST().setToken(DISCORD_TOKEN);

try {
    if (DISCORD_TEST_SERVER_ID && privateCommands.length) {
        const data: any = await rest.put(
            Routes.applicationGuildCommands(
                DISCORD_CLIENT_ID,
                DISCORD_TEST_SERVER_ID
            ),
            { body: privateCommands.map((command) => command.builder.toJSON()) }
        );

        console.info(
            `${
                data?.length ?? "[UNKNOWN]"
            } Private slash commands registered successfully.`
        );
    }

    if (publicCommands.length) {
        const data: any = await rest.put(
            Routes.applicationCommands(DISCORD_CLIENT_ID),
            { body: publicCommands.map((command) => command.builder.toJSON()) }
        );

        console.info(
            `${
                data?.length ?? "[UNKNOWN]"
            } Public slash commands registered successfully.`
        );
    }
} catch (error) {
    console.error(error);
}
