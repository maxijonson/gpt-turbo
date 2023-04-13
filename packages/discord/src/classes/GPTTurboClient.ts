import { Client, ClientOptions, Collection } from "discord.js";
import { DiscordEvent, DiscordSlashCommand } from "../utils/types.js";
import loadCommands from "../utils/loadCommands.js";
import { DISCORD_TOKEN } from "../config/env.js";
import loadEvents from "../utils/loadEvents.js";

export default class GPTTurboClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    public commands = new Collection<string, DiscordSlashCommand>();
    public events = new Collection<string, DiscordEvent>();

    constructor(options: ClientOptions) {
        super(options);
    }

    public async init() {
        await Promise.all([this.initCommands(), this.initEvents()]);
        await this.login(DISCORD_TOKEN);
    }

    override async login(token?: string) {
        if (this.commands.size === 0) {
            throw new Error(
                "No commands loaded. Did you forget to call init()?"
            );
        }
        if (this.events.size === 0) {
            throw new Error("No events loaded. Did you forget to call init()?");
        }
        return super.login(token);
    }

    private async initCommands() {
        const commands = await loadCommands();
        for (const command of commands) {
            this.commands.set(command.builder.name, command);
        }
    }

    private async initEvents() {
        const events = await loadEvents();
        for (const event of events) {
            this.events.set(event.name, event);
            this[event.once ? "once" : "on"](event.name, async (...args) => {
                try {
                    await event.execute(...args);
                } catch (error) {
                    console.error(`Error in event "${event.name}":`);
                    console.error(error);
                }
            });
        }
    }
}
