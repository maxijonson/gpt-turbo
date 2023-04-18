import { Client, ClientOptions } from "discord.js";
import { DISCORD_TOKEN } from "../config/env.js";
import CommandManager from "./CommandManager.js";
import EventManager from "./EventManager.js";

export default class GPTTurboClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    public commandManager: CommandManager = new CommandManager(this);
    public eventManager: EventManager = new EventManager(this);

    constructor(options: ClientOptions) {
        super(options);
    }

    override async login(token = DISCORD_TOKEN) {
        await this.init();
        return super.login(token);
    }

    private async init() {
        await Promise.all([
            this.commandManager.init(),
            this.eventManager.init(),
        ]);
    }
}
