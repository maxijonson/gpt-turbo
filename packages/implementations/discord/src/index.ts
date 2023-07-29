import {
    DiscordjsError,
    DiscordjsErrorCodes,
    GatewayIntentBits,
    Partials,
} from "discord.js";
import GPTTurboClient from "./GPTTurboClient.js";
import { USE_MESSAGE_CONTENT_INTENT } from "./config/env.js";
import "./config/gpt-turbo.js";

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
];

if (USE_MESSAGE_CONTENT_INTENT) {
    intents.push(GatewayIntentBits.MessageContent);
}

try {
    await new GPTTurboClient({
        intents,
        partials: [Partials.Channel],
    }).login();
} catch (error) {
    if (
        error instanceof DiscordjsError &&
        error.code === DiscordjsErrorCodes.DisallowedIntents
    ) {
        console.error(
            "You have enabled the USE_MESSAGE_CONTENT_INTENT option, but have not enabled the Message Content Gateway Intent in the Discord Developer Portal."
        );
    } else {
        console.error(error);
    }
}
