import path from "path";
import { fileURLToPath } from "url";
import { ClientEvents, Collection, Events } from "discord.js";
import { DiscordEvent, DiscordEventType } from "../utils/types.js";
import loadResource from "../utils/loadResource.js";
import GPTTurboClient from "../GPTTurboClient.js";
import AccessRuleManager from "./AccessRuleManager.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";
import makeIsEvent from "../utils/makeIsEvent.js";

export default class EventManager {
    public events = new Collection<string, DiscordEvent>();
    public accessRuleManager = new AccessRuleManager();

    constructor(private client: GPTTurboClient) {}

    public async init() {
        await this.accessRuleManager.init();
        const events = await loadResource<DiscordEvent>(
            path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "..",
                "events"
            ),
            ["name", "execute"]
        );

        for (const event of events) {
            this.events.set(event.name, event);
            this.client[event.once ? "once" : "on"](
                event.name,
                async (...args) => {
                    try {
                        const canExecute = await this.canExecute(
                            event.name,
                            ...args
                        );
                        if (!canExecute) return;

                        await event.execute(...args);
                    } catch (error) {
                        console.error(`Error in event "${event.name}":`);
                        console.error(error);
                    }
                }
            );
        }
    }

    public get isReady() {
        return this.events.size > 0;
    }

    private async handleUnauthorizedException<
        TEventName extends DiscordEventType = DiscordEventType
    >(
        exception: UnauthorizedException,
        event: TEventName,
        ...args: ClientEvents[TEventName]
    ) {
        const isEvent = makeIsEvent<DiscordEventType>(event);

        if (isEvent(Events.InteractionCreate, args)) {
            const [interaction] = args;
            if (!interaction.isRepliable()) return;

            if (interaction.replied) {
                await interaction.followUp({
                    content: exception.message,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: exception.message,
                    ephemeral: true,
                });
            }
        }
    }

    private async canExecute<
        TEventName extends DiscordEventType = DiscordEventType
    >(event: TEventName, ...args: ClientEvents[TEventName]) {
        try {
            const access = await this.accessRuleManager.isEventAllowed(
                event,
                ...args
            );

            if (!access.isAllowed) {
                throw new UnauthorizedException(access.reasons);
            }

            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                await this.handleUnauthorizedException(error, event, ...args);
                return false;
            }
            throw error;
        }
    }
}
