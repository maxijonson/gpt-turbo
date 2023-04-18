import { ClientEvents } from "discord.js";
import { DiscordEventType } from "./types.js";

/**
 * Creates a function that can be used to type guard "args" of an event.
 * Strictly created for typing purposes.
 *
 * @param genericEvent The event to type guard against.
 * @returns A function that can be used to type guard "args" of an event.
 */
export default <TGenericEvent extends DiscordEventType>(
        genericEvent: TGenericEvent
    ) =>
    <TEventName extends TGenericEvent>(
        event: TEventName,
        args: ClientEvents[TGenericEvent]
    ): args is ClientEvents[TEventName] =>
        genericEvent === event;
