import { Client, ClientOptions, Message } from "discord.js";
import { DISCORD_TOKEN } from "./config/env.js";
import CommandManager from "./managers/CommandManager.js";
import EventManager from "./managers/EventManager.js";
import MessageHandler from "./message-handlers/MessageHandler.js";
import IncomingMessageHandler from "./message-handlers/IncomingMessageHandler.js";
import NewConversationHandler from "./message-handlers/NewConverversationHandler.js";

export default class GPTTurboClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    public commandManager: CommandManager = new CommandManager();
    public eventManager: EventManager = new EventManager(this);

    private messageHandler: MessageHandler;

    constructor(options: ClientOptions) {
        super(options);

        this.messageHandler = new IncomingMessageHandler().setNext(
            new NewConversationHandler()
        );
    }

    // @ts-ignore - Since this method was added to the Client interface, TS thinks we're overriding a non-overridable method that doesn't actually exist on the base Client class.
    public handleMessage(message: Message<boolean>) {
        return this.messageHandler.handleMessage(message);
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
