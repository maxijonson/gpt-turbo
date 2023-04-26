import { AccessRule, DiscordEventType } from "./types.js";

/**
 * Type-safe utility function to create an access rule.
 */
export default <TEventName extends DiscordEventType = DiscordEventType>(
    events: TEventName[],
    isAllowed: AccessRule<TEventName>["isAllowed"]
): AccessRule<TEventName> => ({
    events,
    isAllowed,
});
