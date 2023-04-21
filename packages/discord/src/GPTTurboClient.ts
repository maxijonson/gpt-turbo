import { Client, ClientOptions, Message } from "discord.js";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "./config/env.js";
import CommandManager from "./managers/CommandManager.js";
import EventManager from "./managers/EventManager.js";
import MessageHandler from "./message-handlers/MessageHandler.js";
import IncomingMessageHandler from "./message-handlers/IncomingMessageHandler.js";
import NewConversationHandler from "./message-handlers/NewConverversationHandler.js";
import GuildReplyHandler from "./message-handlers/GuildReplyHandler.js";

export default class GPTTurboClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    public id: string;
    public commandManager: CommandManager = new CommandManager();
    public eventManager: EventManager = new EventManager(this);

    private messageHandler: MessageHandler;

    constructor(options: ClientOptions) {
        super(options);

        this.messageHandler = new IncomingMessageHandler().setNext(
            new GuildReplyHandler(),
            new NewConversationHandler()
        );
        this.id = this.user?.id ?? DISCORD_CLIENT_ID;
    }

    // @ts-ignore - Since this method was added to the Client interface, TS thinks we're overriding a non-overridable method that doesn't actually exist on the base Client class.
    public async handleMessage(message: Message<boolean>) {
        const handler = await this.messageHandler.handleMessage(message);
        return handler;
    }

    async login(token = DISCORD_TOKEN) {
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
