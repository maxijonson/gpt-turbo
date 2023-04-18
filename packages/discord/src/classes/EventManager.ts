import path from "path";
import { fileURLToPath } from "url";
import { Collection } from "discord.js";
import { DiscordEvent } from "../utils/types.js";
import loadResource from "../utils/loadResource.js";
import GPTTurboClient from "./GPTTurboClient.js";

export default class EventManager {
    public events = new Collection<string, DiscordEvent>();

    constructor(private client: GPTTurboClient) {}

    public async init() {
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
}
