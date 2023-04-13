import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "../utils/types.js";

export default class GPTTurboClient<Ready extends boolean = boolean>
    extends Client<Ready>
    implements Client
{
    public commands = new Collection<string, Command>();

    constructor(options: ClientOptions) {
        super(options);
    }

    public async init() {
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
                    pathToFileURL(
                        path.join(commandsPath, commandFiles[0])
                    ).toString()
                )
            ).default as Command;

            if (!command) {
                throw new Error(
                    `Command "${commandName}" could not be loaded.`
                );
            }
            if (!command.builder || !command.execute) {
                throw new Error(
                    `Command "${commandName}" does not have a builder or execute.`
                );
            }

            this.commands.set(command.builder.name, command);
        }
    }

    override async login(token?: string) {
        if (this.commands.size === 0) {
            throw new Error(
                "No commands loaded. Did you forget to call init()?"
            );
        }
        return super.login(token);
    }
}
