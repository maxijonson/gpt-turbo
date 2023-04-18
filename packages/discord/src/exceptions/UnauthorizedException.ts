import { AccessRuleDeniedReason } from "../utils/types.js";

export default class UnauthorizedException extends Error {
    constructor(public reasons: AccessRuleDeniedReason[]) {
        super("Access denied");
        this.name = "UnauthorizedException";
        this.message = `Access denied: ${this.reasonMessage}`;
    }

    public get reasonMessage(): string {
        return this.reasons
            .map((reason) => {
                switch (reason) {
                    case AccessRuleDeniedReason.Error:
                        return "An error occurred while checking access rules.";
                    case AccessRuleDeniedReason.NotWhitelisted:
                        return "You or the server is not on the bot's whitelist.";
                    case AccessRuleDeniedReason.BlacklistedUser:
                        return "You are blacklisted from using the GPT Turbo bot.";
                    case AccessRuleDeniedReason.BlacklistedGuild:
                        return "The server is blacklisted from using the GPT Turbo bot.";
                    case AccessRuleDeniedReason.BotUnauthorized:
                        return "This bot is not allowed to use the GPT Turbo bot.";
                    case AccessRuleDeniedReason.BotsUnauthorized:
                        return "Bots are not allowed to use the GPT Turbo bot.";
                    case AccessRuleDeniedReason.DMsUnauthorized:
                        return "DMs are not allowed to use the GPT Turbo bot.";
                    default:
                        return "Unknown reason.";
                }
            })
            .join(" ");
    }
}
