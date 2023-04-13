import { DiscordEvent, DiscordEventType } from "./types.js";

export default <TEventName extends DiscordEventType>(
    name: TEventName,
    execute: DiscordEvent<TEventName>["execute"],
    once = false
): DiscordEvent<TEventName> => ({
    name,
    once,
    execute,
});
