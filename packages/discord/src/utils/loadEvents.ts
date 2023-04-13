import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { DiscordEvent } from "./types.js";

export default async () => {
    const events: DiscordEvent[] = [];

    const eventsPath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "events"
    );

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of eventFiles) {
        const eventName = file.split(".")[0];
        const event = (
            await import(pathToFileURL(path.join(eventsPath, file)).toString())
        ).default as DiscordEvent;

        if (!event) {
            throw new Error(`Event "${eventName}" could not be loaded.`);
        }
        if (!event.name || !event.execute) {
            throw new Error(
                `Command "${eventName}" does not have a builder or execute.`
            );
        }

        events.push(event);
    }

    return events;
};
