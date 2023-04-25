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

const areOptionsDifferent = (
    localOptions: any[],
    remoteOptions: any[]
): boolean => {
    if (localOptions.length !== remoteOptions.length) return true;

    return localOptions.some((localOption) => {
        const remoteOption = remoteOptions.find(
            (cc) => (cc as any).name === localOption.name
        ) as any;
        if (!remoteOption) return true;
        const optionsChanged = areOptionsDifferent(
            localOption.options ?? [],
            remoteOption.options ?? []
        );
        return (
            optionsChanged ||
            localOption.description !== remoteOption.description
        );
    });
};

try {
    const localCommands = commands.map((command) => command.builder.toJSON());
    const remoteCommands = (await rest.get(
        Routes.applicationCommands(DISCORD_CLIENT_ID)
    )) as object[];

    const hasChanged = localCommands.some((localCommand) => {
        const remoteCommand = remoteCommands.find(
            (cc) => (cc as any).name === localCommand.name
        ) as any;
        if (!remoteCommand) return true;
        const optionsChanged = areOptionsDifferent(
            localCommand.options ?? [],
            remoteCommand.options ?? []
        );
        return (
            optionsChanged ||
            localCommand.description !== remoteCommand.description
        );
    });

    if (!hasChanged) {
        console.info("No changes detected, exiting.");
        process.exit();
    }

    const data = (await rest.put(
        Routes.applicationCommands(DISCORD_CLIENT_ID),
        { body: localCommands }
    )) as object[];

    console.info(
        `${data?.length ?? "[UNKNOWN]"} slash commands registered successfully.`
    );
} catch (error) {
    console.error(error);
}
