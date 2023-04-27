import path from "path";
import { fileURLToPath } from "url";
import { ClientEvents, Collection } from "discord.js";
import {
    AccessRule,
    AccessRuleResult,
    AccessRuleDeniedReason,
    DiscordEventType,
    AccessRuleDenied,
} from "../utils/types.js";
import loadResource from "../utils/loadResource.js";

export default class AccessRuleManager {
    public rules = new Collection<DiscordEventType, AccessRule[]>();

    constructor() {}

    public async init() {
        const accessRules = await loadResource<AccessRule>(
            path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "..",
                "access-rules"
            )
        );
        for (const accessRule of accessRules) {
            for (const event of accessRule.events) {
                const rules = this.rules.get(event);
                if (rules) {
                    rules.push(accessRule);
                } else {
                    this.rules.set(event, [accessRule]);
                }
            }
        }
    }

    public async isEventAllowed<
        TEventName extends DiscordEventType = DiscordEventType
    >(
        event: TEventName,
        ...args: ClientEvents[TEventName]
    ): Promise<AccessRuleResult> {
        const eventRules = this.rules.get(event);

        if (!eventRules || !eventRules.length) {
            return {
                isAllowed: true,
            };
        }

        try {
            const results = await Promise.all(
                eventRules.map((rule) => rule.isAllowed(event, ...args))
            );

            const denials = results.filter(
                (result) => !result.isAllowed
            ) as AccessRuleDenied[];

            if (denials.length) {
                return {
                    isAllowed: false,
                    reasons: denials.flatMap((denial) => denial.reasons),
                };
            }

            return {
                isAllowed: true,
            };
        } catch (error) {
            console.error(`Error in access rule for event "${event}":`);
            console.error(error);
            return {
                isAllowed: false,
                reasons: [AccessRuleDeniedReason.Error],
            };
        }
    }
}
