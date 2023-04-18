import path from "path";
import { fileURLToPath } from "url";
import { Collection } from "discord.js";
import { DiscordSlashCommand } from "../utils/types.js";
import loadResource from "../utils/loadResource.js";
import GPTTurboClient from "./GPTTurboClient.js";

export default class CommandManager {
    public commands = new Collection<string, DiscordSlashCommand>();

    constructor(private client: GPTTurboClient) {}

    public async init() {
        const commands = await loadResource<DiscordSlashCommand>(
            path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "..",
                "commands"
            ),
            ["builder", "execute"]
        );
        for (const command of commands) {
            this.commands.set(command.builder.name, command);
        }
    }

    public get isReady() {
        return this.commands.size > 0;
    }
}
