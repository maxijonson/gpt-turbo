import {
    Client,
    ClientOptions,
    Collection,
    Interaction,
    Message,
} from "discord.js";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "./config/env.js";
import CommandManager from "./managers/CommandManager.js";
import EventManager from "./managers/EventManager.js";
import MessageHandler from "./message-handlers/MessageHandler.js";
import NewConversationHandler from "./message-handlers/NewConversationHandler.js";
import GuildReplyHandler from "./message-handlers/GuildReplyHandler.js";
import ThreadMessageHandler from "./message-handlers/ThreadMessageHandler.js";
import DMReplyHandler from "./message-handlers/DMReplyHandler.js";
import ConversationManager from "./managers/ConversationManager.js";
import QuotaManager from "./managers/QuotaManager.js";
import InteractionHandler from "./interaction-handlers/InteractionHandler.js";
import SlashCommandHandler from "./interaction-handlers/SlashCommandHandler.js";
import AdminUsageMenuHandler from "./interaction-handlers/AdminUsageResetMenuHandler.js";
import AdminUsageResetAllHandler from "./interaction-handlers/AdminUsageResetAllHandler.js";
import AdminUsageResetUserMenuHandler from "./interaction-handlers/AdminUsageResetUserMenuHandler.js";
import AdminUsageResetUserHandler from "./interaction-handlers/AdminUsageResetUserHandler.js";
import AdminUsageResetUserShowModalHandler from "./interaction-handlers/AdminUsageResetUserShowModalHandler.js";
import AdminUsageResetUserIdHandler from "./interaction-handlers/AdminUsageResetUserIdHandler.js";

export default class GPTTurboClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    public id: string;
    public commandManager = new CommandManager();
    public eventManager: EventManager = new EventManager(this);
    public quotaManager = new QuotaManager();
    public conversationManager = new ConversationManager(this.quotaManager);

    private cooldowns = new Collection<string, Collection<string, number>>();
    private messageHandler: MessageHandler;
    private interactionHandler: InteractionHandler;

    constructor(options: ClientOptions) {
        super(options);

        this.messageHandler = new DMReplyHandler().setNext(
            new ThreadMessageHandler(),
            new GuildReplyHandler(),
            new NewConversationHandler()
        );

        this.interactionHandler = new SlashCommandHandler().setNext(
            new AdminUsageMenuHandler(),
            new AdminUsageResetAllHandler(),
            new AdminUsageResetUserMenuHandler(),
            new AdminUsageResetUserHandler(),
            new AdminUsageResetUserShowModalHandler(),
            new AdminUsageResetUserIdHandler()
        );

        this.id = this.user?.id ?? DISCORD_CLIENT_ID;
    }

    // @ts-ignore - Since this method was added to the Client interface, TS thinks we're overriding a non-overridable method that doesn't actually exist on the base Client class.
    public async handleMessage(message: Message<boolean>) {
        const handler = await this.messageHandler.handleMessage(message);
        return handler;
    }

    // @ts-ignore - Since this method was added to the Client interface, TS thinks we're overriding a non-overridable method that doesn't actually exist on the base Client class.
    public async handleInteraction(interaction: Interaction) {
        const handler = await this.interactionHandler.handleInteraction(
            interaction
        );
        return handler;
    }

    // @ts-ignore - Since this method was added to the Client interface, TS thinks we're overriding a non-overridable method that doesn't actually exist on the base Client class.
    public isOnCooldown(id: string, action: string, cooldownAmount = 2000) {
        const now = Date.now();
        if (!this.cooldowns.has(id)) {
            this.cooldowns.set(id, new Collection());
        }

        const timestamps = this.cooldowns.get(id)!;
        const actionCooldown = timestamps.get(action);

        if (!actionCooldown) {
            timestamps.set(action, now);
            return false;
        }

        const expirationTime = actionCooldown + cooldownAmount;

        if (now < expirationTime) {
            return true;
        }

        timestamps.set(action, now);
        return false;
    }

    async login(token = DISCORD_TOKEN) {
        await this.init();
        return super.login(token);
    }

    private async init() {
        await Promise.all([
            this.commandManager.init(),
            this.eventManager.init(),
            this.quotaManager.init(),
        ]);
    }
}
