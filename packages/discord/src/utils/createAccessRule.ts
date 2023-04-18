import { AccessRule, DiscordEventType } from "./types.js";

export default <TEventName extends DiscordEventType = DiscordEventType>(
    events: TEventName[],
    isAllowed: AccessRule<TEventName>["isAllowed"]
): AccessRule<TEventName> => ({
    events,
    isAllowed,
});
