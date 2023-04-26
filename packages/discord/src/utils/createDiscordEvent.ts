import { DiscordEvent, DiscordEventType } from "./types.js";

/**
 * Type-safe utility function to create a Discord event.
 */
export default <TEventName extends DiscordEventType>(
    name: TEventName,
    execute: DiscordEvent<TEventName>["execute"],
    once = false
): DiscordEvent<TEventName> => ({
    name,
    once,
    execute,
});
