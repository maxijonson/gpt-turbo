import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "../utils/types.js";
import loadCommands from "../utils/loadCommands.js";

export default class GPTTurboClient<Ready extends boolean = boolean>
    extends Client<Ready>
    implements Client
{
    public commands = new Collection<string, Command>();

    constructor(options: ClientOptions) {
        super(options);
    }

    public async init() {
        const commands = await loadCommands();

        for (const command of commands) {
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
